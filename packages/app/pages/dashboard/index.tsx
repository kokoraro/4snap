import React, { useEffect, useState } from "react";
import MainDashboardLayout from "../../components/Layout/mainDashboard";
import useIsReady from "../../hooks/useIsReady";
import { Spinner } from "../../components/Loader";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { createInAppUser, getUserInfo } from "../../http";
import { HandleUserResponse } from "../../util/response";
import isAuthenticated from "../../util/isAuthenticated";
import withAuth from "../../util/withAuth";
import Modal from "../../components/Modal";
import { isEmpty } from "../../util";
import { toast } from "react-hot-toast";

function Dashboard() {
  const isReady = useIsReady();
  const router = useRouter();
  const userInfoQuery = useQuery({
    queryFn: async () => await getUserInfo(),
    queryKey: ["getUserInfo"],
  });
  const [acctDetails, setAcctDetails] = useState({
    username: "",
    fullname: "",
  });
  const [showModal, setShowModal] = useState(false);
  const createUserMutation = useMutation(async (data: any) =>
    createInAppUser(data)
  );

  const handleAccountInput = (e) => {
    const name = e.target.dataset["name"];
    const val = e.target.value;
    setAcctDetails((prev) => ({ ...prev, [name]: val }));
  };

  const createSnapAcct = () => {
    const { username, fullname } = acctDetails;
    if (isEmpty(username)) {
      toast.error("username cannot be empty");
      return;
    }
    if (isEmpty(fullname)) {
      toast.error("fullname cannot be empty");
      return;
    }
    const userEmail = localStorage.getItem("psg_last_login");
    if (userEmail !== null) {
      createUserMutation.mutate({ username, fullname, email: userEmail });
    }
  };

  useEffect(() => {
    if (!isReady) return;
    if (
      typeof userInfoQuery.data !== "undefined" ||
      userInfoQuery.error !== null
    ) {
      const { data } = userInfoQuery;
      const response = data;
      HandleUserResponse(
        response,
        () => {},
        (data) => {
          if (data !== null) {
            localStorage.setItem("@userInfo", JSON.stringify(response?.data));
            setShowModal(false);
            return;
          }
          setShowModal(true);
        }
      );
    }
  }, [userInfoQuery.data, userInfoQuery]);

  useEffect(() => {
    if (
      typeof createUserMutation.data !== "undefined" ||
      createUserMutation.error !== null
    ) {
      const { data } = createUserMutation;
      const response = data;
      HandleUserResponse(
        response,
        () => createUserMutation.reset(),
        (data) => {},
        () => {
          setShowModal(false);
          userInfoQuery.refetch();
        }
      );
    }
  }, [createUserMutation.data, createUserMutation]);

  if (userInfoQuery.isLoading && isReady === false) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <Spinner color="#3F7EEE" />
      </div>
    );
  }

  return (
    <MainDashboardLayout activeTab="dashboard">
      {!isReady ? (
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <Spinner color="#3F7EEE" />
        </div>
      ) : (
        <div className="w-full">welcome</div>
      )}
      {showModal && (
        <Modal isBlurBg isOpen={true} fixed>
          <div className="w-full h-screen flex flex-col items-center justify-center">
            <div className="w-[350px] h-auto bg-dark-300 rounded-md border-solid border-[1px] border-white-600 ">
              <div className="w-full px-4 py-3 flex flex-col items-start justify-start">
                <p className="text-white-100 pp-SB text-[17px] ">
                  Create 4Snap Account
                </p>
                <p className="text-white-300 pp-RG text-[13px] ">
                  create 4snap account to manage all saved commands.
                </p>
              </div>
              <div className="w-full px-4 py-3 flex flex-col items-start justify-start mb-5">
                <input
                  type="username"
                  placeholder="username"
                  className="w-full rounded-md px-3 py-3 border-solid border-[1px] border-white-600 bg-dark-100 mb-4 outline-none text-white-100 text-[14px]"
                  data-name="username"
                  onChange={handleAccountInput}
                  defaultValue={acctDetails.username}
                />
                <input
                  type="fullname"
                  placeholder="fullname"
                  className="w-full rounded-md px-3 py-3 border-solid border-[1px] border-white-600 bg-dark-100 outline-none text-white-100 text-[14px]"
                  data-name="fullname"
                  onChange={handleAccountInput}
                  defaultValue={acctDetails.fullname}
                />
                <br />
                <button
                  className="w-full flex items-center justify-center text-center text-[14px] pp-SB text-white-100 bg-blue-300 rounded-md px-3 py-3 scale-[.95] hover:scale-[.99] transition-all "
                  onClick={createSnapAcct}
                >
                  {createUserMutation.isLoading ? (
                    <Spinner color="#fff" />
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </MainDashboardLayout>
  );
}

export default withAuth(Dashboard);
