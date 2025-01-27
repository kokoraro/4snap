import ImageTag from "../components/Image";
import { AiFillPlusCircle, AiOutlineCloudSync } from "react-icons/ai";
import { useEffect, useState } from "react";
import { BsViewList } from "react-icons/bs";
import { IoShareOutline } from "react-icons/io5";
import { MdDirectionsRun } from "react-icons/md";
import Link from "next/link";
import { BiCopy, BiSolidLockOpen } from "react-icons/bi";
import { useQuery } from "react-query";
import { retrieveAllCommands } from "../http";
import { HandleCommandResponse } from "../util/response";
import { Spinner } from "../components/Loader";
import Modal from "../components/Modal";
import { copyToClipboard } from "../util";
import { toast } from "react-hot-toast";

interface AllCmds {
  _id: string;
  userId: string;
  name: string;
  command: string;
  public: boolean;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("create");
  const [allCmds, setAllCmds] = useState<AllCmds[]>([]);
  const allCmdQuery = useQuery({
    queryFn: async () => await retrieveAllCommands(),
    queryKey: ["retrieveAllCommands"],
  });
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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(allCmds.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentList = allCmds.slice(startIndex, endIndex);

  const nextList = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevList = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSelectingCmdList = (id: string) => {
    const filteredCmd = allCmds.filter((c) => c._id === id);
    if (filteredCmd.length > 0) {
      setSelectedCmd(filteredCmd[0] as any);
      setIsViewModalOpen(!isViewModalOpen);
    }
  };

  const defaultStyle = `hover:bg-gradient-to-b hover:from-white-600 hover:to-dark-300 border-solid border-[.5px] hover:border-white-600`;

  const renderActiveStyle = (name: string) => {
    if (name === activeTab) {
      return "bg-gradient-to-b from-white-600 to-dark-300 border-solid border-[.5px] border-white-600 opacity-[1] ";
    }
    return "opacity-[.7] border-transparent";
  };

  const toggleTab = (name: string) => setActiveTab(name);

  const renderTabTitle = () => {
    const msg = {
      create: "Create and customize new commands.",
      list: "View a list of available commands.",
      sync: "Synchronize command list from cloud.",
      share: "Share commands with others.",
      exec: "Execute available command either public or private.",
    };
    return msg[activeTab];
  };

  const img = {
    create: `/screenshots/create.png`,
    share: `/screenshots/share.png`,
    exec: `/screenshots/exec.png`,
    list: `/screenshots/list.png`,
    sync: `/screenshots/sync.png`,
  };

  const renderTabImage = () => {};

  useEffect(() => {
    if (typeof allCmdQuery.data !== "undefined" || allCmdQuery.error !== null) {
      const { data } = allCmdQuery;
      const response = data;
      HandleCommandResponse(
        response,
        () => {},
        (data) => {
          setAllCmds(data);
        }
      );
    }
  }, [allCmdQuery.data, allCmdQuery]);

  return (
    <div className="w-full h-screen overflow-x-hidden scroll-smooth pattern-bg">
      {/* Topbar */}
      <div className="w-full px-4 py-3 flex items-center justify-between">
        <div className="w-auto  flex items-center justify-center gap-2">
          <ImageTag src="/logo.png" className="w-[30%] " />
          <p className="text-white-100 pp-EB text-[20px] ">4Snap</p>
        </div>
        <div className="w-auto flex items-center justify-center">
          <Link
            href="/auth"
            onClick={() => (location.href = "/auth")}
            className="px-6 py-2 text-[12px] rounded-[30px] bg-blue-300 text-white-100 pp-SB z-[10] scale-[.95] hover:scale-[1] transition-all "
          >
            Login
          </Link>
        </div>
      </div>
      {/* header */}
      <div className="w-full h-auto min-h-[400px] z-[10] py-4 mt-7">
        <div className="w-full px-5 md:px-5 md:max-w-[70%] mx-auto text-center flex flex-col items-center justify-center">
          <p className="text-white-100 text-center pp-EB text-3xl md:text-5xl z-[10]">
            Discover, Share, & Execute Commands Anytime Anywhere
          </p>
          <br />
          <p className="text-white-300 pp-RG text-[12px] md:text-1xl z-[10] ">
            Empower yourself with{" "}
            <span className="text-white-100 pp-EB">4Snap</span>, the ultimate
            command companion. Carry your favorite commands in your pocket,
            execute them remotely, and watch your efficiency soar!
          </p>
        </div>
        <div className="w-full mt-20 flex items-center justify-center">
          <Link
            href="/auth"
            onClick={() => (location.href = "/auth")}
            className="px-6 py-3 text-[14px] md:text-[15px] rounded-[30px] bg-blue-300 text-white-100 pp-SB z-[10] scale-[.95] hover:scale-[1] transition-all "
          >
            Get Started
          </Link>
        </div>
      </div>
      {/* Content */}
      <div className="w-full  min-h-[750px] flex flex-col items-center justify-start">
        <div className="w-auto max-w-[300px]  md:max-w-[300px] flex flex-col items-center justify-center bg-gradient-to-b from-white-600 to-dark-300 border-solid border-[1px] border-white-600 mx-auto text-center z-[10] rounded-[30px]">
          <span className="text-white-100 pp-SB text-[10px] px-2 py-1 ">
            {renderTabTitle()}
          </span>
        </div>
        <br />
        <div className="w-auto max-w-[380px] md:max-w-[400px] z-[10] bg-gradient-to-b from-dark-300 to-dark-300 border-solid border-[1px] border-white-600 p-1 rounded-[10px] flex items-start justify-start shadow-2xl scale-[.85] md:scale-[1] ">
          <button
            className={`w-[80px] h-[70px] flex flex-col items-center justify-center gap-1 outline-none px-5 py-3 rounded-md scale-[.95] ${defaultStyle} ${renderActiveStyle(
              "create"
            )} hover:scale-[1] transition-all hover:opacity-[1] `}
            onClick={() => toggleTab("create")}
          >
            <AiFillPlusCircle size={25} className="text-white-200" />
            <span className="text-white-300 pp-SB text-[10px] ">Create</span>
          </button>
          <button
            className={`w-[80px] h-[70px] flex flex-col items-center justify-center gap-1 outline-none px-5 py-3 rounded-md scale-[.95] ${defaultStyle} ${renderActiveStyle(
              "list"
            )} hover:scale-[1] transition-all hover:opacity-[1] `}
            onClick={() => toggleTab("list")}
          >
            <BsViewList size={25} className="text-white-200" />
            <span className="text-white-300 pp-SB text-[12px] ">List</span>
          </button>
          <button
            className={`w-[80px] h-[70px] flex flex-col items-center justify-center gap-1 outline-none px-5 py-3 rounded-md scale-[.95] ${defaultStyle} ${renderActiveStyle(
              "sync"
            )} hover:scale-[1] transition-all hover:opacity-[1] `}
            onClick={() => toggleTab("sync")}
          >
            <AiOutlineCloudSync size={25} className="text-white-200" />
            <span className="text-white-300 pp-SB text-[12px] ">Sync</span>
          </button>
          <button
            className={`w-[80px] h-[70px] flex flex-col items-center justify-center gap-1 outline-none px-5 py-3 rounded-md scale-[.95] ${defaultStyle} ${renderActiveStyle(
              "share"
            )} hover:scale-[1] transition-all hover:opacity-[1] `}
            onClick={() => toggleTab("share")}
          >
            <IoShareOutline size={25} className="text-white-200" />
            <span className="text-white-300 pp-SB text-[12px] ">Share</span>
          </button>
          <button
            className={`w-[80px] h-[70px] flex flex-col items-center justify-center gap-1 outline-none px-5 py-3 rounded-md scale-[.95] ${defaultStyle} ${renderActiveStyle(
              "exec"
            )} hover:scale-[1] transition-all hover:opacity-[1] `}
            onClick={() => toggleTab("exec")}
          >
            <MdDirectionsRun size={25} className="text-white-200" />
            <span className="text-white-300 pp-SB text-[12px] ">Execute</span>
          </button>
        </div>
        <div className="w-full md:w-[400px] px-5 mt-8 flex flex-col items-center justify-center relative">
          {/* <div
            className="w-full max-w-[450px] h-[300px] bg-dark-300 z-[10] rounded-md"
            style={{
              backgroundImage: `url("${renderTabImage()}")`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          ></div> */}
          {activeTab === "create" && (
            <ImageTag
              src={img.create}
              className="w-full absolute top-[-10px] rounded-md shadow-2xl z-[10]"
            />
          )}
          {activeTab === "list" && (
            <ImageTag
              src={img.list}
              className="w-full absolute top-[-10px] rounded-md shadow-2xl z-[10]"
            />
          )}
          {activeTab === "sync" && (
            <ImageTag
              src={img.sync}
              className="w-full absolute top-[-10px] rounded-md shadow-2xl z-[10]"
            />
          )}
          {activeTab === "share" && (
            <ImageTag
              src={img.share}
              className="w-full absolute top-[-10px] rounded-md shadow-2xl z-[10]"
            />
          )}
          {activeTab === "exec" && (
            <ImageTag
              src={img.exec}
              className="w-full absolute top-[-10px] rounded-md shadow-2xl z-[10]"
            />
          )}
        </div>
        <br />
      </div>
      {/* Documentation */}
      <div className="w-full min-h-[700px] mt-20 flex flex-col items-center justify-start">
        <p className="text-white-100 text-center pp-EB text-3xl md:text-5xl z-[10]">
          Get Started
        </p>
        <p className="text-white-300 text-center  mt-2 pp-RG text-[12px] md:text-1xl z-[10] ">
          Get started with <span className="text-white-100 pp-EB">4Snap </span>
          by following this steps below.
        </p>
        <br />
        <div className="w-full h-auto px-4 py-9 md:max-w-[80%] mx-auto flex flex-wrap items-start justify-between">
          {/* Cards */}
          <div className="w-full h-auto flex flex-col items-start justify-start z-[10] rounded-md bg-dark-300 border-solid border-[1px] border-white-600">
            <br />
            {/* Account Creation */}
            <div className="w-full p-3 border-b-solid border-b-[.5px] border-b-white-600 flex flex-col items-start justify-start">
              <span className=" text-3xl px-4 py-1 pp-EB rounded-[7px] bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 text-white-100 ">
                1
              </span>
              <p className="text-white-100 mt-2 text-center pp-EB text-1xl md:text-1xl z-[10]">
                Account Creation
              </p>
              <p className="text-white-300 mt-2 pp-RG text-[12px] z-[10] ">
                Get started by creating an account on{" "}
                <span className="text-white-300 pp-EB">4Snap</span> using this{" "}
                <Link href={"/auth"} className="text-white-100 underline pp-EB">
                  LINK
                </Link>
              </p>
            </div>
            <br />
            {/* NPM INSTALL */}
            <div className="w-full p-3 border-b-solid border-b-[.5px] border-b-white-600 mt-5 flex flex-col items-start justify-start">
              <span className=" text-3xl px-4 py-1 pp-EB rounded-[7px] bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 text-white-100 ">
                2
              </span>
              <p className="text-white-100 mt-2 text-center pp-EB text-1xl md:text-1xl z-[10]">
                Install 4Snap CLI
              </p>
              <p className="text-white-300 mt-2 pp-RG text-[12px] z-[10] ">
                After creating an account on 4snap, you need to install 4Snap
                cli npm package by running the command below:
              </p>
              <div className="w-full bg-dark-100 rounded-md px-4 py-3 mt-3 flex items-start justify-start">
                <p className="text-[12px] font-mono ">
                  <span className="text-white-400">{"// npm users"}</span>
                  <br />
                  <span className="text-white-300">$</span>
                  <span className="text-white-100 ml-2 font-extrabold ">
                    npm install 4snap
                  </span>
                  <br />
                  <br />
                  <span className="text-white-400">{"// yarn users"}</span>
                  <br />
                  <span className="text-white-300">$</span>
                  <span className="text-white-100 ml-2 font-extrabold ">
                    yarn add 4snap
                  </span>
                </p>
              </div>
            </div>

            {/* 4Snap CLI Auth */}
            <div className="w-full p-3 border-b-solid border-b-[.5px] border-b-white-600 mt-7 flex flex-col items-start justify-start">
              <span className=" text-3xl px-4 py-1 pp-EB rounded-[7px] bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 text-white-100 ">
                3
              </span>
              <p className="text-white-100 mt-2 text-center pp-EB text-1xl md:text-1xl z-[10]">
                Authenticate 4Snap CLI
              </p>
              <p className="text-white-300 mt-2 pp-RG text-[12px] z-[10] ">
                Before any command can be executed, you need to authenticate
                4Snap cli using the command below:
              </p>
              <div className="w-full bg-dark-100 rounded-md px-4 py-3 mt-3 flex items-start justify-start">
                <p className="text-[12px] font-mono ">
                  <span className="text-white-300">$</span>
                  <span className="text-white-100 ml-2 font-extrabold ">
                    4snap login
                  </span>
                </p>
              </div>
              <p className="text-white-300 mt-2 pp-RG text-[12px] z-[10] ">
                The command would prompt you for a 4Snap token which can be
                gotten from your settings page on 4Snap if youre currently
                logged in.
              </p>
            </div>

            {/* Create command */}
            <div className="w-full p-3 border-b-solid border-b-[.5px] border-b-white-600 mt-7 flex flex-col items-start justify-start">
              <span className=" text-3xl px-4 py-1 pp-EB rounded-[7px] bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 text-white-100 ">
                4
              </span>
              <p className="text-white-100 mt-2 text-center pp-EB text-1xl md:text-1xl z-[10]">
                Create commands
              </p>
              <p className="text-white-300 mt-2 pp-RG text-[12px] z-[10] ">
                A command or collections of commands can be created either using
                the web interface or cli. For 4snap users, command can be
                created by running the below command:
              </p>
              <div className="w-full bg-dark-100 rounded-md px-4 py-3 mt-3 flex items-start justify-start">
                <p className="text-[12px] font-mono ">
                  <span className="text-white-300">$</span>
                  <span className="text-white-100 ml-2 font-extrabold ">
                    4snap create
                  </span>
                </p>
              </div>
              <p className="text-white-300 mt-2 pp-RG text-[12px] z-[10] ">
                This would be a nice interaction which would work you through
                the steps needed to create your favorite command or collections
                of commands. Also, collections of commands are created by the
                separation of{" "}
                <span className="text-white-100 pp-EB">comma (,)</span>
              </p>
            </div>

            {/* Execute command */}
            <div className="w-full p-3 border-b-solid border-b-[.5px] border-b-white-600 mt-7 flex flex-col items-start justify-start">
              <span className=" text-3xl px-4 py-1 pp-EB rounded-[7px] bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 text-white-100 ">
                5
              </span>
              <p className="text-white-100 mt-2 text-center pp-EB text-1xl md:text-1xl z-[10]">
                Executing command
              </p>
              <p className="text-white-300 mt-2 pp-RG text-[12px] z-[10] ">
                You can execute either local or public command available on yout
                machine or on the cloud. For{" "}
                <span className="text-white-100 pp-SB">LOCAL</span> command, run
                the command below:
              </p>
              <div className="w-full bg-dark-100 rounded-md px-4 py-3 mt-3 flex items-start justify-start">
                <p className="text-[12px] font-mono ">
                  <span className="text-white-300">$</span>
                  <span className="text-white-100 ml-2 font-extrabold ">
                    4snap run [COMMAND_NAME]
                  </span>
                </p>
              </div>
              <p className="text-white-300 mt-2 pp-RG text-[12px] z-[10] ">
                For <span className="text-white-100 pp-SB">PUBLIC</span>{" "}
                command, run the command below:
              </p>
              <div className="w-full bg-dark-100 rounded-md px-4 py-3 mt-3 flex items-start justify-start">
                <p className="text-[12px] font-mono ">
                  <span className="text-white-300">$</span>
                  <span className="text-white-100 ml-2 font-extrabold ">
                    4snap run -p [COMMAND_NAME]
                  </span>
                </p>
              </div>
            </div>

            {/* Synchronization */}
            <div className="w-full p-3 border-b-solid border-b-[.5px] border-b-white-600 mt-7 flex flex-col items-start justify-start">
              <span className=" text-3xl px-4 py-1 pp-EB rounded-[7px] bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 text-white-100 ">
                6
              </span>
              <p className="text-white-100 mt-2 text-center pp-EB text-1xl md:text-1xl z-[10]">
                Synchronization
              </p>
              <p className="text-white-300 mt-2 pp-RG text-[12px] z-[10] ">
                Sometimes, the command created via web interface might not be
                what on your local machine, to fix this and make sure all
                created collections of commands are available on your local
                machine, you would need to{" "}
                <span className="text-white-100 pp-SB">Synchronize</span> the
                commands. This can be done using the command below:
              </p>
              <div className="w-full bg-dark-100 rounded-md px-4 py-3 mt-3 flex items-start justify-start">
                <p className="text-[12px] font-mono ">
                  <span className="text-white-300">$</span>
                  <span className="text-white-100 ml-2 font-extrabold ">
                    4snap sync
                  </span>
                </p>
              </div>
            </div>

            {/* View saved commands */}
            <div className="w-full p-3 border-b-solid border-b-[.5px] border-b-white-600 mt-7 flex flex-col items-start justify-start">
              <span className=" text-3xl px-4 py-1 pp-EB rounded-[7px] bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 text-white-100 ">
                7
              </span>
              <p className="text-white-100 mt-2 text-center pp-EB text-1xl md:text-1xl z-[10]">
                View saved commands
              </p>
              <p className="text-white-300 mt-2 pp-RG text-[12px] z-[10] ">
                Viewing of saved commands or collections of commands locally can
                be done using the command below:
              </p>
              <div className="w-full bg-dark-100 rounded-md px-4 py-3 mt-3 flex items-start justify-start">
                <p className="text-[12px] font-mono ">
                  <span className="text-white-300">$</span>
                  <span className="text-white-100 ml-2 font-extrabold ">
                    4snap list
                  </span>
                </p>
              </div>
              <p className="text-white-300 mt-2 pp-RG text-[12px] z-[10] ">
                This would print out all available saved command in a table
                format on your terminal as seen in the image above on tab view.
              </p>
            </div>

            {/* Sharing of command */}
            <div className="w-full p-3 border-b-solid border-b-[.5px] border-b-white-600 mt-7 flex flex-col items-start justify-start">
              <span className=" text-3xl px-4 py-1 pp-EB rounded-[7px] bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 text-white-100 ">
                8
              </span>
              <p className="text-white-100 mt-2 text-center pp-EB text-1xl md:text-1xl z-[10]">
                Sharing Command
              </p>
              <p className="text-white-300 mt-2 pp-RG text-[12px] z-[10] ">
                Sometimes, you may not have access to all commands, or perhaps
                you want to share your saved commands with others, whether
                publicly or privately. You can easily accomplish this using the
                following command:
              </p>
              <div className="w-full bg-dark-100 rounded-md px-4 py-3 mt-3 flex items-start justify-start">
                <p className="text-[12px] font-mono ">
                  <span className="text-white-300">$</span>
                  <span className="text-white-100 ml-2 font-extrabold ">
                    4snap share -u [USER_NAME] [COMMAND_NAME]
                  </span>
                </p>
              </div>
              <p className="text-white-300 mt-2 pp-RG text-[12px] z-[10] ">
                This would transfer the following command specified by the user
                to the recipient. Also Note, this user must have an account on
                4Snap for this to work effectively.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Explore section */}
      <div className="w-full z-[10] min-h-[300px] mt-[120px] flex flex-col items-center justify-start">
        <p className="text-white-100 text-center pp-EB text-3xl md:text-5xl z-[10]">
          Explore
        </p>
        <p className="text-white-300 mt-2 pp-RG text-[12px] md:text-[14px] z-[10] ">
          Explore publicly saved commands from{" "}
          <span className="text-white-100 pp-EB">4Snap </span> users.
        </p>
        <br />
        <div className="w-full md:max-w-[80%] mx-auto flex items-start justify-start px-9 py-4">
          <button
            className={`ml-2 px-3 py-2 flex items-center justify-center border-solid border-[1px] ${
              currentPage === 1
                ? "text-white-300 bg-transparent cursor-not-allowed"
                : "text-white-100 bg-blue-300"
            } border-white-600 scale-[.95] hover:scale-[1] transition-all pp-SB text-[12px] rounded-md z-[10] `}
            onClick={prevList}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            className={`ml-1 px-3 py-2 flex items-center justify-center border-solid border-[1px] ${
              currentPage === totalPages || allCmds.length === 0
                ? "text-white-300 bg-transparent cursor-not-allowed"
                : "text-white-100 bg-blue-300"
            } border-white-600 scale-[.95] hover:scale-[1] transition-all pp-SB text-[12px] rounded-md z-[10] `}
            onClick={nextList}
            disabled={currentPage === totalPages || allCmds.length === 0}
          >
            Next
          </button>
        </div>
        <div className="w-full md:max-w-[80%] mx-auto flex flex-wrap items-start justify-start gap-5 px-9 py-4">
          {allCmdQuery.isLoading && (
            <div className="w-full flex items-center justify-center">
              <Spinner color="#fff" />
            </div>
          )}
          {allCmdQuery.isLoading === false && allCmds.length > 0 ? (
            currentList.map((cmd) => (
              <CommandLists
                handleSelectingCmdList={handleSelectingCmdList}
                name={cmd.name}
                id={cmd._id}
                key={cmd._id}
              />
            ))
          ) : (
            <p className="text-white-300 mt-2 pp-RG text-[15px] z-[10] ">
              No public commands from
              <span className="text-white-100 pp-EB ml-1"> 4Snap </span> users.
            </p>
          )}
        </div>
      </div>

      {/* View command info modal */}
      {isViewModalOpen && (
        <Modal
          isBlurBg
          isOpen={isViewModalOpen}
          showCloseIcon
          onClose={() => setIsViewModalOpen(!isViewModalOpen)}
        >
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-[300px] md:w-[400px] h-auto rounded-md bg-dark-300 border-solid border-[.5px] border-white-600 ">
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

      {/* Footer */}
      <div className="w-full h-auto z-[10] mt-7 bg-dark-600"></div>
    </div>
  );
}

interface CommandListProps {
  name: string;
  id: string;
  key: any;
  handleSelectingCmdList: (id: string) => void;
}

function CommandLists({
  name,
  id,
  key,
  handleSelectingCmdList,
}: CommandListProps) {
  const copyToken = () => {
    const command = `4snap run ${name}`;
    copyToClipboard(command);
    toast.success("command copied.");
  };

  return (
    <button
      data-id={id}
      key={key}
      onClick={() => handleSelectingCmdList(id)}
      className={`w-full md:w-auto h-auto flex items-start justify-start bg-dark-300 py-4 px-3 rounded-lg text-white-100 z-[10] border-transparent hover:border-solid border-[1px] hover:border-white-600  `}
    >
      <div className="w-[50px] h-[50px] flex items-center justify-center p-4 rounded-lg border-solid border-[.5px] border-white-600 ">
        <span className="text-2xl">📦</span>
      </div>
      <div className="w-full flex flex-col items-start justify-start ml-2 gap-2">
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
    </button>
  );
}
