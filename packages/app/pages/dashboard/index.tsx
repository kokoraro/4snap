/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import MainDashboardLayout from "../../components/Layout/mainDashboard";
import useIsReady from "../../hooks/useIsReady";
import { Spinner } from "../../components/Loader";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import {
  createInAppUser,
  getUserInfo,
  retrieveInAppCommands,
  retrieveSharedCommands,
} from "../../http";
import { HandleCommandResponse, HandleUserResponse } from "../../util/response";
import isAuthenticated from "../../util/isAuthenticated";
import withAuth from "../../util/withAuth";
import Modal from "../../components/Modal";
import { isEmpty } from "../../util";
import { toast } from "react-hot-toast";
import DashboardHeader from "../../components/DashboardHeader";
import { BiCommand } from "react-icons/bi";
import { BsArrowDownLeft, BsArrowUpRight } from "react-icons/bs";

function Dashboard() {
  const isReady = useIsReady();
  const router = useRouter();
  const [acctDetails, setAcctDetails] = useState({
    username: "",
    fullname: "",
  });
  const [allCmds, setAllCmds] = useState(0);
  const [sharedCmd, setSharedCmd] = useState({
    sent: 0,
    received: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const userInfoQuery = useQuery({
    queryFn: async () => await getUserInfo(),
    queryKey: ["getUserInfo"],
  });
  const getInAppCommandQuery = useQuery({
    queryFn: async () => await retrieveInAppCommands(),
    queryKey: ["getInAppCommandQuery"],
  });
  const getSharedCommandQuery = useQuery({
    queryFn: async () => await retrieveSharedCommands(),
    queryKey: ["retrieveSharedCommands"],
  });
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
    if (!isReady) return;
    if (
      typeof getInAppCommandQuery.data !== "undefined" ||
      getInAppCommandQuery.error !== null
    ) {
      const { data } = getInAppCommandQuery;
      const response = data;
      HandleCommandResponse(
        response,
        () => {},
        (data) => {
          setAllCmds(data?.length ?? 0);
        }
      );
    }
  }, [getInAppCommandQuery.data, getInAppCommandQuery]);

  useEffect(() => {
    if (!isReady) return;
    if (
      typeof getSharedCommandQuery.data !== "undefined" ||
      getSharedCommandQuery.error !== null
    ) {
      const { data } = getSharedCommandQuery;
      const response = data;
      HandleCommandResponse(
        response,
        () => {},
        (data) => {
          setSharedCmd(data);
        }
      );
    }
  }, [getSharedCommandQuery.data, getSharedCommandQuery]);

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

  return (
    <MainDashboardLayout activeTab="dashboard">
      <DashboardHeader />
      {!isReady ||
      userInfoQuery.isLoading ||
      getSharedCommandQuery.isLoading ? (
        <div className="w-full h-auto mt-6 flex flex-col items-center justify-center">
          <Spinner color="#3F7EEE" />
        </div>
      ) : (
        <div className="w-full relative h-auto px-[2em] flex flex-col items-start justify-between gap-7">
          <div className="w-full flex flex-col items-start justify-around">
            <div className="w-full absolute top-[-40px] left-10 flex items-center justify-start gap-5">
              <AnalyticsCard
                // data={siteViews}
                title="Command Lists"
                Icon={
                  <BiCommand className="p-1 text-white-400 text-3xl rounded-md" />
                }
                count={allCmds}
              />
              <AnalyticsCard
                title="Sent CMD"
                Icon={
                  <BsArrowUpRight className="p-1 text-green-400 text-3xl rounded-md" />
                }
                count={sharedCmd.sent}
              />
              <AnalyticsCard
                title="Received CMD"
                Icon={
                  <BsArrowDownLeft className="p-1 text-blue-300 text-3xl rounded-md" />
                }
                count={sharedCmd.received}
              />
            </div>
          </div>
        </div>
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

interface AnanlyticsCardProps {
  title: string;
  data?: { views: number; slug: string; date: string }[];
  count: number;
  Icon: React.ReactNode;
}

function AnalyticsCard({ title, Icon, data, count }: AnanlyticsCardProps) {
  return (
    <div className="w-[200px] max-w-[250px] h-full max-h-[150px] px-5 py-5 rounded-md bg-dark-200 flex flex-col items-start justify-start gap-5  relative overflowHidden shadow-lg border-[1px] border-solid border-white-600 ">
      <div className="w-full z-[10] ">
        <div className="top w-full flex items-center justify-between gap-2">
          <div className="flex items-center justify-start ">
            {Icon}
            <p className="text-white-300 pp-SB ">{title}</p>
          </div>
          <div className="absolute w-[100px] top-5 right-2 flex flex-col items-start justify-start"></div>
        </div>
        <div className="bottom w-full flex flex-col items-start justify-start mt-5">
          <p className="text-white-100 pp-SB text-5xl">{count}</p>
        </div>
      </div>
      <div className="w-full absolute bottom-[-4px] left-[-5px]">
        {/* <TinyAreaChart data={data} dataKey="uv" /> */}
      </div>
    </div>
  );
}
