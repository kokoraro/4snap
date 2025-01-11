import moment from "moment";
import next from "next";
import { useState, useEffect } from "react";

function DashboardHeader() {
  const [userInfo, setUserInfo] = useState<any>({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("@userInfo")) ?? null;
    setUserInfo(userData);
  }, []);

  return (
    <div className="w-full h-[20em] flex items-start justify-center bg-dark-200 px-1 mt-[-9px] py-[15px] ">
      <div className="w-full px-[2em] flex items-start justify-between">
        <div className="left w-auto flex flex-col items-start justify-start gap-5">
          <p className="text-white-300 text-[13px] ">
            Overview / <span className="text-white-100 pp-SB">Ananlytics</span>
          </p>
          <p className="text-white-200 text-4xl">
            Welcome Back,{" "}
            <span className="pp-SB text-white-100">{userInfo?.username}</span>
          </p>
          <p className="text-white-300 text-[13px] ">
            Great to have you here..
          </p>
        </div>
        <div className="right w-auto flex flex-col items-start justify-start gap-5">
          <p className="text-white-300 text-[13px] ">
            {moment().format("dddd MMMM Do YYYY, h:mm a")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
