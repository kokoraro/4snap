import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { RxCaretDown } from "react-icons/rx";
import ImageTag from "../Image";
import { BiCog } from "react-icons/bi";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { IoLockOpen } from "react-icons/io5";

function TopBar() {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolledPast, setIsScrolledPast] = useState(false);
  const [userInfo, setUserInfo] = useState<any>({});

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userData"));
    setUserInfo(userInfo);
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (scrollY > 30) {
      setIsScrolledPast(true);
    } else {
      setIsScrolledPast(false);
    }
  }, [scrollY]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("authToken");
    location.href = "/auth/login";
  };

  return (
    <div
      className={`w-full h-auto border-b-[1px] border-b-white-600 fixed top-0 left-0 z-[200] bg-dark-100 backdrop-blur bg-opacity-75 `}
    >
      <div className="w-full px-[2rem] flex items-center justify-between">
        <div className="w-auto left flex items-center justify-center">
          <div className="w-auto flex items-center justify-center">
            {/* <span className="text-white-200 ml-2 pp-EB text-[13px] ">showccial</span> */}
          </div>
        </div>
        <div className="w-auto px-7 left flex items-center justify-center">
          <ul className="ml-[3rem] flex items-center justify-center gap-5">
            <li className="text-white-200 text-[13.5px] pp-RG ">
              {/* @ts-ignore */}
              <Menu>
                <MenuButton
                  as={Button as any}
                  rightIcon={<BiCog className=" text-white-100 text-2xl " />}
                  background="none"
                  _active={{
                    backgroundColor: "transparent",
                  }}
                  _hover={{
                    backgroundColor: "transparent",
                  }}
                ></MenuButton>
                {/* @ts-ignore */}
                <MenuList
                  width={120}
                  className="w-[100px]"
                  background={"#131418"}
                  borderColor={"#26282c"}
                  padding={0}
                  marginTop={2}
                >
                  {/* @ts-ignore */}
                  <MenuItem
                    background={"#131418"}
                    _hover={{ backgroundColor: "#1E1E22" }}
                    padding={2}
                    borderRadius={5}
                    onClick={handleLogout}
                  >
                    <IoLockOpen className="text-white-200 mr-2" size={20} />{" "}
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </li>
            <li className="text-white-200 text-[13.5px] mb-2 py-1 pp-RG flex items-center justify-center ">
              <ImageTag
                src={
                  userInfo?.image ??
                  "https://api.dicebear.com/5.x/micah/svg?seed=Baby"
                }
                className="bg-dark-200 border-solid border-[1px] border-blue-300 rounded-[100%] w-[30px] mr-2 "
              />
              {/* <img
                src="https://api.dicebear.com/5.x/micah/svg?seed=Baby"
                className="bg-dark-200 border-solid border-[1px] border-blue-300 rounded-[100%] w-[30px] mr-2 "
              /> */}
              <div className="right w-auto flex flex-col items-start justify-start">
                <p className="text-white-100 pp-EB">
                  {userInfo?.username ?? "N/A"}
                </p>
                <small className="text-white-200">Developer</small>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
