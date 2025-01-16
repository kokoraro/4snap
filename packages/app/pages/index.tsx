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
  }>({ command: "", name: "", _id: "", description: "", public: false });

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
          <svg className="scale-[.60] " width="63" height="60" fill="none">
            <mask id="a" fill="#fff">
              <path d="M62.22 40.97v2.18L62.19 45a26.32 26.32 0 0 1-.36 3.99 12.77 12.77 0 0 1-6.92 9.38 13.71 13.71 0 0 1-3.83 1.26c-1.34.23-2.7.31-4.04.35-2.6.03-3.33.03-4.07.03H19.25c-2.82 0-3.44-.01-4.06-.03-1.35-.04-2.71-.12-4.04-.35a13.71 13.71 0 0 1-3.85-1.26A12.9 12.9 0 0 1 .4 48.98a26.33 26.33 0 0 1-.36-4 81.1 81.1 0 0 1-.02-1.83L0 40.97V19.03v-2.18l.03-1.84c.04-1.33.12-2.67.36-4A12.76 12.76 0 0 1 7.3 1.64 13.71 13.71 0 0 1 11.14.39c1.33-.23 2.69-.31 4.04-.35C17.78 0 18.52 0 19.25 0H42.37h-8.95 9.55c2.83 0 3.45.01 4.07.03 1.34.04 2.7.12 4.04.35 1.35.24 2.61.64 3.84 1.26a12.89 12.89 0 0 1 6.91 9.38c.24 1.32.32 2.66.36 4 .02.6.02 1.22.03 1.83v24.12z"></path>
            </mask>
            <path
              d="M62.22 40.97v2.18L62.19 45a26.32 26.32 0 0 1-.36 3.99 12.77 12.77 0 0 1-6.92 9.38 13.71 13.71 0 0 1-3.83 1.26c-1.34.23-2.7.31-4.04.35-2.6.03-3.33.03-4.07.03H19.25c-2.82 0-3.44-.01-4.06-.03-1.35-.04-2.71-.12-4.04-.35a13.71 13.71 0 0 1-3.85-1.26A12.9 12.9 0 0 1 .4 48.98a26.33 26.33 0 0 1-.36-4 81.1 81.1 0 0 1-.02-1.83L0 40.97V19.03v-2.18l.03-1.84c.04-1.33.12-2.67.36-4A12.76 12.76 0 0 1 7.3 1.64 13.71 13.71 0 0 1 11.14.39c1.33-.23 2.69-.31 4.04-.35C17.78 0 18.52 0 19.25 0H42.37h-8.95 9.55c2.83 0 3.45.01 4.07.03 1.34.04 2.7.12 4.04.35 1.35.24 2.61.64 3.84 1.26a12.89 12.89 0 0 1 6.91 9.38c.24 1.32.32 2.66.36 4 .02.6.02 1.22.03 1.83v24.12z"
              fill="#000"
            ></path>
            <path
              d="M62.22 43.15l-3.5-.02 3.5.02zM62.19 45l-3.5-.1 3.5.1zm-.36 3.99l-3.44-.63 3.44.63zm-1.26 3.8l-3.11-1.6 3.1 1.6zm-2.38 3.23l2.46 2.5L58.2 56zm-3.27 2.35l-1.57-3.12 1.57 3.12zm-3.84 1.26l-.61-3.45.6 3.45zm-4.04.35l.04 3.5h.05l-.1-3.5zM19.25 60l-.01 3.5h.01V60zm-4.06-.03l.1-3.5-.1 3.5zm-4.04-.35l.6-3.45-.6 3.45zM7.3 58.36l1.58-3.12-1.58 3.12zm-3.27-2.35l-2.46 2.5L4.03 56zm-2.38-3.23l-3.1 1.6 3.1-1.6zM.4 48.98l-3.45.63 3.45-.63zm-.36-4l3.5-.09-3.5.1zm-.02-1.83l3.5-.02-3.5.02zm0-26.3l3.5.03v-.01L0 16.85zm.02-1.84l3.5.1-3.5-.1zm.36-4l-3.45-.62 3.45.63zm1.26-3.79l-3.1-1.6 3.1 1.6zm2.38-3.23L6.5 6.48l-2.46-2.5zM7.3 1.64l1.58 3.12L7.3 1.64zM11.15.38l.6 3.45-.6-3.45zm4.04-.35l-.04-3.5h-.06l.1 3.5zM42.37 0v3.5-7V0zm-8.95 0v-3.5 7V0zm9.55 0l.01-3.5V0zm4.07.03l-.1 3.5.1-3.5zm4.04.35l-.61 3.45.6-3.45zm3.84 1.26l-1.58 3.12 1.58-3.12zm3.27 2.35l-2.46 2.48L58.2 4zm2.38 3.23l-3.11 1.6 3.1-1.6zm1.26 3.8l-3.44.62 3.44-.62zm.36 4l-3.5.09 3.5-.1zm.03 1.83l-3.5.02 3.5-.02zm-3.5 24.12v2.16l7 .04v-2.2h-7zm0 2.16c0 .6-.01 1.18-.03 1.76l7 .2.03-1.92-7-.04zm-.03 1.76c-.03 1.27-.1 2.41-.3 3.46l6.89 1.26c.29-1.58.37-3.14.4-4.53l-6.99-.19zm-.3 3.47a9.84 9.84 0 0 1-.93 2.82l6.22 3.2c.8-1.56 1.3-3.14 1.6-4.77l-6.89-1.25zm-.93 2.82a9.27 9.27 0 0 1-1.73 2.35l4.92 4.97c1.22-1.2 2.25-2.6 3.03-4.12l-6.22-3.2zm-1.73 2.35c-.7.69-1.5 1.27-2.38 1.7l3.14 6.26a16.42 16.42 0 0 0 4.16-2.99l-4.92-4.97zm-2.39 1.7c-.88.46-1.81.75-2.87.94l1.22 6.9a17.2 17.2 0 0 0 4.8-1.58l-3.15-6.25zm-2.87.94c-1.08.2-2.24.27-3.53.3l.19 7c1.4-.04 2.97-.12 4.56-.4l-1.22-6.9zm-3.48.3c-2.58.03-3.3.03-4.02.03v7c.75 0 1.5 0 4.1-.03l-.08-7zm-4.02.03H27.7v7h15.28v-7zm-15.28 0h-8.44v7h8.44v-7zm-8.43 0c-2.84 0-3.41-.01-3.98-.03l-.19 7c.67.02 1.34.02 4.15.03l.02-7zm-3.98-.03c-1.29-.03-2.45-.1-3.52-.3l-1.23 6.9c1.6.28 3.16.36 4.56.4l.2-7zm-3.52-.3a10.22 10.22 0 0 1-2.88-.93l-3.15 6.25a17.2 17.2 0 0 0 4.8 1.57l1.23-6.89zm-2.88-.93a9.4 9.4 0 0 1-2.39-1.71L1.57 58.5a16.4 16.4 0 0 0 4.16 3l3.15-6.26zm-2.39-1.71a9.3 9.3 0 0 1-1.73-2.35l-6.22 3.2a16.3 16.3 0 0 0 3.03 4.12l4.92-4.97zm-1.72-2.35a9.9 9.9 0 0 1-.94-2.83l-6.89 1.26c.3 1.63.8 3.21 1.6 4.77l6.23-3.2zm-.94-2.83c-.19-1.05-.26-2.18-.3-3.46l-7 .2c.04 1.38.13 2.94.41 4.52l6.9-1.26zm-.3-3.46l-.02-1.76-7 .04c0 .63 0 1.27.02 1.91l7-.2zm-.02-1.77l-.01-2.15h-7v2.2l7-.05zm-.01-2.15v-7.23h-7v7.23h7zm0-7.23v-7.48h-7v7.48h7zm0-7.48v-7.23h-7v7.23h7zm0-7.23v-2.15l-7-.06v2.21h7zm0-2.16c0-.6.02-1.18.03-1.76l-7-.2-.02 1.92 7 .04zm.03-1.76c.04-1.28.11-2.41.3-3.47l-6.89-1.25a29.75 29.75 0 0 0-.4 4.53l7 .19zm.3-3.46a9.9 9.9 0 0 1 .94-2.83l-6.23-3.2c-.8 1.56-1.3 3.14-1.6 4.77l6.9 1.26zm.94-2.83a9.26 9.26 0 0 1 1.72-2.34L1.57 1.49a16.26 16.26 0 0 0-3.03 4.13l6.23 3.2zm1.72-2.35c.7-.69 1.5-1.26 2.39-1.7L5.73-1.5A16.37 16.37 0 0 0 1.57 1.5l4.92 4.97zm2.39-1.7c.89-.46 1.81-.75 2.88-.94l-1.23-6.9c-1.64.3-3.23.79-4.8 1.58l3.15 6.25zm2.88-.94c1.07-.2 2.23-.27 3.52-.3l-.19-7c-1.4.04-2.97.12-4.56.4l1.23 6.9zm3.47-.3c2.58-.03 3.3-.03 4.02-.03v-7c-.75 0-1.5 0-4.1.03l.08 7zm4.02-.03h8.44v-7h-8.44v7zm8.44 0h14.68v-7H27.7v7zm14.68-7h-8.95v7h8.95v-7zm-8.95 7h9.55v-7h-9.55v7zm9.54 0c2.84 0 3.41.01 3.98.03l.2-7c-.68-.02-1.35-.02-4.16-.03l-.02 7zm3.98.03c1.3.03 2.45.1 3.53.3l1.22-6.9a30.67 30.67 0 0 0-4.56-.4l-.19 7zm3.53.3c1.06.19 1.99.48 2.87.93l3.15-6.25a17.2 17.2 0 0 0-4.8-1.57l-1.22 6.89zm2.88.93a9.39 9.39 0 0 1 2.38 1.71l4.92-4.97a16.39 16.39 0 0 0-4.16-3l-3.14 6.26zm2.38 1.72c.7.68 1.28 1.48 1.73 2.34l6.22-3.2a16.23 16.23 0 0 0-3.03-4.13l-4.92 4.99zm1.73 2.34c.45.87.74 1.78.93 2.82l6.89-1.25c-.3-1.63-.8-3.21-1.6-4.77l-6.22 3.2zm.93 2.82c.2 1.06.27 2.2.3 3.47l7-.2c-.04-1.38-.12-2.94-.41-4.52l-6.89 1.25zm.3 3.47c.02.58.02 1.16.03 1.76l7-.04-.03-1.91-7 .2zm.03 1.76v2.16h7v-2.2l-7 .04zm0 2.16v7.23h7v-7.23h-7zm0 7.23v7.48h7v-7.48h-7zm0 7.48v7.23h7v-7.23h-7z"
              fill="url(#paint0_linear)"
              mask="url(#a)"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M24.48 25.83c0-.27.22-.5.5-.5h9.2c.28 0 .5.23.5.5v1a.5.5 0 0 1-.5.5h-9.2a.5.5 0 0 1-.5-.5v-1zM21.05 20.19a.3.3 0 0 0-.07-.49l-3.57-1.9a.3.3 0 0 1-.14-.38l2.46-6.12c.11-.29-.25-.54-.48-.33l-7.75 7a.3.3 0 0 0 .03.48l3.44 2.33a.3.3 0 0 1 .11.36l-2.24 5.71c-.12.3.24.54.48.33l7.73-7z"
              fill="#fff"
            ></path>
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="32.22"
                x2="32.22"
                y2="63.33"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#F743B6"></stop>
                <stop offset="1" stop-color="#FCC043"></stop>
              </linearGradient>
            </defs>
          </svg>
          <p className="text-white-100 pp-EB text-[20px] ">4Snap</p>
        </div>
        <div className="w-auto flex items-center justify-center">
          <Link
            href="/auth"
            className="px-6 py-2 text-[12px] rounded-[30px] bg-blue-300 text-white-100 pp-SB z-[10] scale-[.95] hover:scale-[1] transition-all "
          >
            Login
          </Link>
        </div>
      </div>
      {/* header */}
      <div className="w-full h-auto z-[10] py-4 mt-7">
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
      </div>
      {/* Content */}
      <div className="w-full min-h-[750px] flex flex-col items-center justify-center">
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
                  </p>
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
