import { BiCopy, BiRotateRight } from "react-icons/bi";
import MainDashboardLayout from "../components/Layout/mainDashboard";
import { useMutation, useQuery } from "react-query";
import { getAuthToken, rotateAuthToken } from "../http";
import { useEffect, useState } from "react";
import { HandleUserResponse } from "../util/response";
import { Spinner } from "../components/Loader";
import { CgSpinner } from "react-icons/cg";
import { copyToClipboard } from "../util";
import { toast } from "react-hot-toast";

export default function Settings() {
  const userTokenQuery = useQuery({
    queryFn: async () => await getAuthToken(),
    queryKey: ["getAuthToken"],
  });
  const rotateTokenMutation = useMutation(async () => await rotateAuthToken());
  const [token, setToken] = useState("");

  const copyToken = () => {
    copyToClipboard(token);
    toast.success("Token copied.");
  };

  useEffect(() => {
    if (
      typeof userTokenQuery.data !== "undefined" ||
      userTokenQuery.error !== null
    ) {
      const { data } = userTokenQuery;
      const response = data;
      HandleUserResponse(
        response,
        () => {},
        (data) => {
          if (data !== null) {
            setToken(data);
            return;
          }
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTokenQuery.data]);

  useEffect(() => {
    if (
      typeof rotateTokenMutation.data !== "undefined" ||
      rotateTokenMutation.error !== null
    ) {
      const { data } = rotateTokenMutation;
      const response = data;
      HandleUserResponse(
        response,
        () => {},
        (data) => {
          if (data !== null) {
            setToken(data);
            return;
          }
        }
      );
    }
  }, [rotateTokenMutation.data, rotateTokenMutation]);

  if (userTokenQuery.isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <Spinner color="#3F7EEE" />
      </div>
    );
  }

  const spinAnim = rotateTokenMutation.isLoading
    ? "animate-spin"
    : "animate-none";

  return (
    <MainDashboardLayout activeTab="settings">
      <div className="w-full flex flex-col items-start justify-start">
        <div className="w-full h-auto max-h-[100px] flex flex-col items-start justify-start px-5 py-4 border-b-solid border-b-[1px] border-b-white-600 ">
          <h2 className="text-white-100 pp-SB text-[20px] ">Settings</h2>
          <p className="text-slate-200 text-[13px] pp-RG ">
            Manage 4Snap Config.
          </p>
        </div>
        <br />
        {/* <div className="w-full h-auto">
        </div> */}
        <div className="w-full flex flex-col items-start justify-start px-5 py-2">
          {/* Notion Integration */}
          <div className="w-full max-w-[450px] flex flex-col items-start justify-start">
            <p className="text-white-100 pp-SB text-[18px] ">4Snap Token</p>
            <p className="text-white-300 pp-RG text-[13px] ">
              Add your notion integration token. Dont know where to find one,
              follow this guide
            </p>
            <br />
            <div className="w-full flex items-start justify-start gap-3">
              <input
                type="text"
                className="w-full px-4 py-4 text-[12px] rounded-md bg-dark-300 pp-RG text-white-100 border-none outline-none "
                placeholder="secret_7JuYFMeNMdssGSgzcdWm8wD4hDxcKXlaaJFFVTQXZQez"
                defaultValue={token}
                disabled
              />
              <button
                className="ml-2 px-4 py-4 flex items-center justify-center border-solid border-[1px] bg-dark-300 border-white-600 scale-[.95] hover:text-white-100 hover:scale-[1] transition-all pp-EB text-[13px] rounded-lg"
                onClick={() => rotateTokenMutation.mutate()}
              >
                <BiRotateRight
                  size={16}
                  className={"text-white-100 " + spinAnim}
                  //   className="animate-spin text-white-100"
                />
              </button>
              <button
                className="px-4 py-4 flex items-center justify-center border-solid border-[1px] bg-dark-300 border-white-600 scale-[.95] hover:text-white-100 hover:scale-[1] transition-all pp-EB text-[13px] rounded-lg"
                onClick={copyToken}
              >
                <BiCopy size={16} className={"text-white-200 "} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainDashboardLayout>
  );
}
