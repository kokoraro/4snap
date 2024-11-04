import { useRouter } from "next/router";
import MainDashboardLayout from "../../components/Layout/mainDashboard";
import useIsReady from "../../hooks/useIsReady";
import serverPassageAuth from "../../util/serverPassageAuth";
import { useMutation, useQuery } from "react-query";
import { Spinner } from "../../components/Loader";
import { CgSpinner } from "react-icons/cg";
import { AiFillDelete } from "react-icons/ai";
import { BiCopy } from "react-icons/bi";
import { copyToClipboard } from "../../util";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  createInAppCommands,
  deleteInAppCommands,
  retrieveInAppCommands,
} from "../../http";
import { HandleCommandResponse } from "../../util/response";

export default function Commands({ isAuthorized }) {
  const isReady = useIsReady();
  const router = useRouter();
  const [allCmds, setAllCmds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cmdName, setCmdName] = useState("");
  const [loadingStack, setLoadingStack] = useState<{ id: string }[]>([]);
  const getCommandQuery = useQuery({
    queryFn: async () => await retrieveInAppCommands(),
    queryKey: ["retrieveInAppCommands"],
    enabled: isAuthorized,
  });
  const createMeetingMutation = useMutation(async (data: any) =>
    createInAppCommands(data)
  );
  const deleteMeetingMutation = useMutation(async (data: any) =>
    deleteInAppCommands(data)
  );

  if (!isAuthorized) {
    router.push("/auth");
  }

  useEffect(() => {
    if (
      typeof getCommandQuery.data !== "undefined" ||
      getCommandQuery.error !== null
    ) {
      const { data } = getCommandQuery;
      const response = data;
      HandleCommandResponse(
        response,
        () => {},
        (data) => {
          setAllCmds(data);
        }
      );
    }
  }, [getCommandQuery.data]);

  function createCommand() {
    if (cmdName.length === 0) {
      toast.error("meeting name is empty.");
      return;
    }
    createMeetingMutation.mutate({ name: cmdName });
  }

  function deleteCommand(id: string) {
    setLoadingStack((prev) => [...prev, { id }]);
    deleteMeetingMutation.mutate({ id });
  }

  return (
    <MainDashboardLayout activeTab="commands">
      {!isReady ? (
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <Spinner color="#3F7EEE" />
        </div>
      ) : (
        <div className="w-full h-full relative flex flex-col items-start justify-start ">
          <div className="relative w-full h-auto border-b-solid border-b-[.5px] border-b-white-600 py-3 px-4 flex flex-col items-start justify-start">
            <h1 className="font-extrabold pp-EB text-[1em] text-white-100">
              Share and Execute Commands Anytime, Anywhere
            </h1>
            <p className="text-white-300 text-[13px] pp-RG">
              Take command of your productivity with a cloud-powered tool that
              lets you carry and execute your favorite commands anywhere,
              anytime.
            </p>
            <br />
            <button
              className="w-auto px-4 py-2 rounded-md bg-blue-300 text-white-100 pp-SB text-[14px]"
              // onClick={() => setIsModalOpen(!isModalOpen)}
            >
              Create New Command
            </button>
          </div>
          <div className="w-full h-auto py-5 px-3 flex flex-wrap items-start justify-start gap-5">
            {allCmds.length > 0
              ? allCmds.map((d, i) => (
                  <CommandLists
                    name={d.name}
                    slug={d.slug}
                    id={d.id}
                    key={d.id}
                    deleteCommand={deleteCommand}
                    loadingStack={loadingStack}
                  />
                ))
              : null}
          </div>
        </div>
      )}
    </MainDashboardLayout>
  );
}

interface CommandListProps {
  name: string;
  slug: string;
  id: string;
  deleteCommand: (id: string) => void;
  loadingStack: { id: string }[];
}

function CommandLists({
  name,
  slug,
  id,
  deleteCommand,
  loadingStack,
}: CommandListProps) {
  const copyToken = () => {
    const { location } = window;
    const url = `${location.origin}/meet/${slug}`;
    copyToClipboard(url);
    toast.success("Url copied.");
  };

  const currentStack = loadingStack.filter((d) => d.id === id) ?? null;

  return (
    <div
      data-id={id}
      key={id}
      className={`w-auto h-auto flex items-start justify-start bg-dark-300 py-4 px-3 rounded-lg text-white-100`}
    >
      <div className="w-[50px] h-[50px] flex items-center justify-center p-4 rounded-lg border-solid border-[.5px] border-white-600 ">
        <span className="text-2xl">📽</span>
      </div>
      <div className="w-full flex flex-col items-start justify-start ml-2 gap-2">
        <p className="text-white-100 pp-SB text-[14px]">
          {name ?? "Meeting Name"}
        </p>
        <div className="w-full flex flex-wrap items-start justify-start gap-2">
          <span className="text-white-400 text-[12px] pp-RG">{slug}</span>
        </div>
      </div>
      <button
        className="ml-2 px-3 py-3 flex items-center justify-center border-solid border-[1px] border-white-600 scale-[.95] hover:scale-[1] transition-all pp-EB text-[13px] rounded-lg"
        onClick={copyToken}
      >
        <BiCopy color="#ccc" />
      </button>
      <button
        className="ml-2 px-3 py-3 flex items-center justify-center border-solid border-[1px] border-white-600 scale-[.95] hover:bg-red-305 hover:text-white-100 hover:scale-[1] transition-all pp-EB text-[13px] rounded-lg"
        onClick={() => deleteCommand(id)}
      >
        {currentStack !== null && currentStack[0]?.id === id ? (
          <CgSpinner color="#fff" className=" animate-spin " size={14} />
        ) : (
          <AiFillDelete />
        )}
      </button>
    </div>
  );
}

export async function getServerSideProps(context) {
  // getServerSideProps runs server-side only and will never execute on the client browser
  // this allows the safe use of a private Passage API Key
  return await serverPassageAuth(context);
}
