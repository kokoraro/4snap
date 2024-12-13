import { useRouter } from "next/router";
import MainDashboardLayout from "../../components/Layout/mainDashboard";
import useIsReady from "../../hooks/useIsReady";
import serverPassageAuth from "../../util/serverPassageAuth";
import { useMutation, useQuery } from "react-query";
import { Spinner } from "../../components/Loader";
import { CgSpinner } from "react-icons/cg";
import { AiFillDelete } from "react-icons/ai";
import { BiCopy } from "react-icons/bi";
import { copyToClipboard, isEmpty } from "../../util";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  createInAppCommands,
  deleteInAppCommands,
  retrieveInAppCommands,
} from "../../http";
import { HandleCommandResponse } from "../../util/response";
import isAuthenticated from "../../util/isAuthenticated";
import withAuth from "../../util/withAuth";
import Modal from "../../components/Modal";

function Commands() {
  const isReady = useIsReady();
  const [allCmds, setAllCmds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inpData, setInpData] = useState({
    name: "",
    commands: "",
  });
  const [loadingStack, setLoadingStack] = useState<{ id: string }[]>([]);
  const getCommandQuery = useQuery({
    queryFn: async () => await retrieveInAppCommands(),
    queryKey: ["retrieveInAppCommands"],
  });
  const createCommandMutation = useMutation(async (data: any) =>
    createInAppCommands(data)
  );
  const deleteCommandMutation = useMutation(async (data: any) =>
    deleteInAppCommands(data)
  );

  const toggleModal = () => setIsModalOpen(!isModalOpen);

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
          console.log(data);
        }
      );
    }
  }, [getCommandQuery.data]);

  useEffect(() => {
    if (
      typeof createCommandMutation.data !== "undefined" ||
      createCommandMutation.error !== null
    ) {
      const { data } = createCommandMutation;
      const response = data;
      HandleCommandResponse(
        response,
        () => createCommandMutation.reset(),
        () => {},
        () => getCommandQuery.refetch()
      );
    }
  }, [createCommandMutation.data]);

  useEffect(() => {
    if (
      typeof deleteCommandMutation.data !== "undefined" ||
      deleteCommandMutation.error !== null
    ) {
      const { data } = deleteCommandMutation;
      const response = data;
      HandleCommandResponse(
        response,
        () => {
          deleteCommandMutation.reset();
          setLoadingStack([]);
        },
        () => {},
        () => getCommandQuery.refetch()
      );
    }
  }, [deleteCommandMutation.data]);

  function createCommand() {
    const { name, commands } = inpData;
    if (isEmpty(name) || isEmpty(commands)) {
      toast.error("some fields are empty.");
      return;
    }
    createCommandMutation.mutate({ name, command: commands });
  }

  function deleteCommand(id: string) {
    setLoadingStack((prev) => [...prev, { id }]);
    deleteCommandMutation.mutate({ id });
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
              onClick={() => setIsModalOpen(!isModalOpen)}
            >
              Create New Command
            </button>
          </div>
          <div className="w-full h-auto py-5 px-3 flex flex-wrap items-start justify-start gap-5">
            {getCommandQuery.isLoading ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Spinner color="#3F7EEE" />
              </div>
            ) : allCmds.length > 0 ? (
              allCmds.map((d, i) => (
                <CommandLists
                  name={d.name}
                  slug={d.slug}
                  id={d._id}
                  key={d._id}
                  deleteCommand={deleteCommand}
                  loadingStack={loadingStack}
                />
              ))
            ) : null}

            {allCmds.length === 0 && (
              <div className="w-full flex items-center justify-center">
                <p className="text-white-300 pp-RG">No Commands available.</p>
              </div>
            )}
          </div>
        </div>
      )}
      <Modal isBlurBg isOpen={isModalOpen} showCloseIcon onClose={toggleModal}>
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="w-[400px] h-auto rounded-md bg-dark-300 border-solid border-[.5px] border-white-600 ">
            <div className="w-full border-b-solid border-b-[.5px] border-b-white-600 flex flex-col items-center justify-center py-2">
              <p className="text-white-100 text-[18px] pp-SB">
                Create New Command
              </p>
            </div>
            <br />
            <div className="w-full px-3 flex flex-col items-start justify-start mb-3">
              <input
                type="text"
                className="w-full px-3 py-3 outline-none text-[14px] bg-dark-100 text-white-100 rounded-md"
                placeholder="Command Name"
                maxLength={30}
                onChange={(e) =>
                  setInpData((prev) => ({ ...prev, ["name"]: e.target.value }))
                }
                defaultValue={inpData.name}
              />
              <br />
              <textarea
                className="w-full px-3 py-3 outline-none text-[14px] bg-dark-100 text-white-100 rounded-md"
                placeholder={`commands separated by comma eg "mkdir test, cd test, code ." `}
                maxLength={30}
                rows={3}
                cols={10}
                onChange={(e) =>
                  setInpData((prev) => ({
                    ...prev,
                    ["commands"]: e.target.value,
                  }))
                }
                defaultValue={inpData.commands}
              />
              <br />
              <button
                className="w-full mt-3 px-4 py-2 rounded-md bg-blue-300 text-white-100 pp-SB text-[14px]"
                disabled={createCommandMutation.isLoading}
                onClick={createCommand}
              >
                {createCommandMutation.isLoading ? (
                  <div className="w-full flex items-center justify-center gap-4">
                    <Spinner color="#fff" /> Creating
                  </div>
                ) : (
                  "Create Command"
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </MainDashboardLayout>
  );
}

export default withAuth(Commands);

interface CommandListProps {
  name: string;
  slug: string;
  id: string;
  deleteCommand: (id: string) => void;
  loadingStack: { id: string }[];
  key: any;
}

function CommandLists({
  name,
  slug,
  id,
  key,
  deleteCommand,
  loadingStack,
}: CommandListProps) {
  const copyToken = () => {
    const { location } = window;
    const url = `qwik run ${name}`;
    copyToClipboard(url);
    toast.success("command copied.");
  };

  const mainStack = loadingStack.filter((d) => d.id === id);
  const currentStack = mainStack.length === 0 ? null : mainStack;

  return (
    <button
      data-id={id}
      key={key}
      className={`w-auto h-auto flex items-start justify-start bg-dark-300 py-4 px-3 rounded-lg text-white-100`}
    >
      <div className="w-[50px] h-[50px] flex items-center justify-center p-4 rounded-lg border-solid border-[.5px] border-white-600 ">
        <span className="text-2xl">📦</span>
      </div>
      <div className="w-full flex flex-col items-start justify-start ml-2 gap-2">
        <p className="text-white-100 pp-SB text-[14px]">
          {name ?? "Meeting Name"}
        </p>
        <div className="w-full flex flex-wrap items-start justify-start gap-2">
          <span className="text-white-300 font-mono pp-SB text-[10px] pp-RG"></span>
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
    </button>
  );
}

export async function getServerSideProps(context) {
  // getServerSideProps runs server-side only and will never execute on the client browser
  // this allows the safe use of a private Passage API Key
  return await serverPassageAuth(context);
}
