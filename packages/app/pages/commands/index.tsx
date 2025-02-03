/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import MainDashboardLayout from "../../components/Layout/mainDashboard";
import useIsReady from "../../hooks/useIsReady";
import serverPassageAuth from "../../util/serverPassageAuth";
import { useMutation, useQuery } from "react-query";
import { Spinner } from "../../components/Loader";
import { CgSpinner } from "react-icons/cg";
import { AiFillDelete } from "react-icons/ai";
import { BiCopy } from "react-icons/bi";
import { copyToClipboard, isEmpty, isValidCliCommand } from "../../util";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  createInAppCommands,
  deleteInAppCommands,
  retrieveInAppCommands,
} from "../../http";
import { HandleCommandResponse } from "../../util/response";
import withAuth from "../../util/withAuth";
import Modal from "../../components/Modal";
import ImageTag from "../../components/Image";

function Commands() {
  const isReady = useIsReady();
  const [allCmds, setAllCmds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCmd, setSelectedCmd] = useState<{
    command: string;
    name: string;
    _id: string;
    description: string;
    public: boolean;
    user: {
      username: string;
      fullname: string;
    };
  }>({
    command: "",
    name: "",
    _id: "",
    description: "",
    public: false,
    user: { username: "", fullname: "" },
  });
  const [inpData, setInpData] = useState({
    name: "",
    commands: "",
    description: "",
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

  const handleSelectingCmdList = (id: string) => {
    const filteredCmd = allCmds.filter((c) => c._id === id);
    if (filteredCmd.length > 0) {
      setSelectedCmd(filteredCmd[0]);
      setIsViewModalOpen(!isViewModalOpen);
    }
  };

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
        () => {
          setIsModalOpen(false);
          getCommandQuery.refetch();
        }
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
    const { name, commands, description } = inpData;
    if (isEmpty(name) || isEmpty(commands)) {
      toast.error("command name cant be empty.");
      return;
    }
    if (!isValidCliCommand(commands)) {
      toast.error("Invalid command.");
      return;
    }
    if (!isValidCliCommand(description)) {
      toast.error("description can't be empty.");
      return;
    }
    createCommandMutation.mutate({ name, command: commands, description });
  }

  function deleteCommand(id: string) {
    const confirm = window.confirm("Are you sure about this action?");
    if (confirm) {
      setLoadingStack((prev) => [...prev, { id }]);
      deleteCommandMutation.mutate({ id });
    }
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
                  id={d._id}
                  key={d._id}
                  deleteCommand={deleteCommand}
                  loadingStack={loadingStack}
                  handleSelectingCmdList={handleSelectingCmdList}
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

      {/* Create command modal */}
      {isModalOpen && (
        <Modal
          isBlurBg
          isOpen={isModalOpen}
          showCloseIcon
          onClose={toggleModal}
        >
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
                  className="w-full px-3 py-3 outline-none text-[14px] bg-dark-100 text-white-100 font-mono rounded-md"
                  placeholder="Command Name"
                  maxLength={30}
                  onChange={(e) =>
                    setInpData((prev) => ({
                      ...prev,
                      ["name"]: e.target.value,
                    }))
                  }
                  defaultValue={inpData.name}
                />
                <br />
                <input
                  type="text"
                  className="w-full px-3 py-3 outline-none text-[14px] bg-dark-100 text-white-100 font-mono rounded-md"
                  placeholder="Description"
                  maxLength={60}
                  onChange={(e) =>
                    setInpData((prev) => ({
                      ...prev,
                      ["description"]: e.target.value,
                    }))
                  }
                  defaultValue={inpData.description}
                />
                <br />
                <textarea
                  className="w-full px-3 py-3 outline-none text-[12px] bg-dark-100 text-white-100 font-mono rounded-md"
                  placeholder={`commands separated by comma eg "mkdir test, cd test, code ." `}
                  maxLength={100}
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
      )}

      {/* View command info modal */}
      {isViewModalOpen && (
        <Modal
          isBlurBg
          isOpen={isViewModalOpen}
          showCloseIcon
          onClose={() => setIsViewModalOpen(!isViewModalOpen)}
        >
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-[400px] h-auto rounded-md bg-dark-300 border-solid border-[.5px] border-white-600 ">
              <div className="w-full border-b-solid border-b-[.5px] border-b-white-600 flex flex-col items-center justify-center py-2">
                <p className="text-white-100 text-[18px] pp-SB">
                  {selectedCmd?.name}
                </p>
              </div>
              <br />
              <div className="w-full px-3 flex flex-col items-start justify-start mb-3">
                <p className="text-white-300 mt-2 pp-RG text-[12px] z-[10] ">
                  <span className="animate-pulse mr-2 relative">
                    {selectedCmd?.public ? "🟢" : "🔴"}
                  </span>
                  {selectedCmd?.description}
                </p>
                <div className="w-full bg-dark-100 rounded-md px-4 py-3 mt-3 flex items-start justify-start">
                  <p className="text-[12px] font-mono ">
                    <span className="text-white-400">
                      {"// 4snap logged in users"}
                    </span>
                    <br />
                    <span className="text-white-300">$</span>
                    <span className="text-white-100 ml-2 font-extrabold ">
                      {`4snap run ${selectedCmd?.name ?? ""}`}
                    </span>
                    <br />
                    <br />
                    <span className="text-white-400">{"// raw command"}</span>
                    <br />
                    <span className="text-white-300">$</span>
                    <span className="text-white-100 ml-2 font-extrabold ">
                      {selectedCmd?.command ?? ""}
                    </span>
                  </p>
                </div>
                <br />
                <div className="w-full py-3 mt-3 flex items-start justify-start border-t-solid border-t-[.5px] border-t-white-600 ">
                  <ImageTag
                    src={`https://api.dicebear.com/5.x/micah/svg?seed=${selectedCmd?.user?.username}`}
                    className="bg-dark-200 border-solid border-[2px] border-blue-300 rounded-[100%] w-[35px] mr-2 "
                  />
                  <div className="w-auto flex flex-col items-start justify-start">
                    <p className="text-white-100 pp-SB text-[13px] ">
                      {selectedCmd?.user?.fullname}
                    </p>
                    <p className="text-white-300 italic pp-RG text-[12px] ">
                      @{selectedCmd?.user?.username}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </MainDashboardLayout>
  );
}

export default withAuth(Commands);

interface CommandListProps {
  name: string;
  id: string;
  deleteCommand: (id: string) => void;
  handleSelectingCmdList: (id: string) => void;
  loadingStack: { id: string }[];
  key: any;
}

function CommandLists({
  name,
  id,
  key,
  deleteCommand,
  loadingStack,
  handleSelectingCmdList,
}: CommandListProps) {
  const copyToken = () => {
    const { location } = window;
    const url = `4snap run ${name}`;
    copyToClipboard(url);
    toast.success("command copied.");
  };

  const mainStack = loadingStack.filter((d) => d.id === id);
  const currentStack = mainStack.length === 0 ? null : mainStack;

  return (
    <div
      data-id={id}
      key={key}
      className={`w-auto h-auto flex items-start justify-start bg-dark-300 py-4 px-3 rounded-lg text-white-100`}
    >
      <div className="w-[50px] h-[50px] flex items-center justify-center p-4 rounded-lg border-solid border-[.5px] border-white-600 ">
        <span className="text-2xl">📦</span>
      </div>
      <div
        className="w-full flex flex-col items-start cursor-pointer justify-start ml-2 gap-2"
        onClick={() => handleSelectingCmdList(id)}
      >
        <p className="text-white-100 pp-SB text-[14px]">
          {name ?? "Meeting Name"}
        </p>
        <div className="w-full mr-3 flex flex-wrap items-start justify-start gap-2">
          <span className="text-white-300 font-mono text-[10px]">{`4snap run ${name}`}</span>
        </div>
      </div>
      <button
        className="ml-2 px-3 py-3 flex items-center justify-center border-solid border-[1px] border-white-600 scale-[.95] hover:scale-[1] transition-all pp-EB text-[13px] rounded-lg"
        onClick={copyToken}
      >
        <BiCopy color="#ccc" />
      </button>
      <button
        data-name={"deleteButton"}
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
