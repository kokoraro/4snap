import { IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoClose } from "react-icons/io5";

interface ModalProp {
  isOpen?: boolean;
  onClose?: () => void;
  showCloseIcon?: boolean;
  children?: React.ReactNode;
  isBlurBg?: boolean;
  fixed?: boolean;
}

const Modal = ({
  children,
  isOpen,
  showCloseIcon,
  onClose,
  fixed,
}: ModalProp) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const blurBg = `backdrop-blur-xl opacity-[1]`;
  const transBg = ``;

  React.useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleClickOutside = (e: Event) => {
    const tgt = (e.target as any)?.dataset;
    const name = tgt.name;
    name && onClose;
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.classList.remove("modal-open");
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`w-full hideScrollBar backdrop-blur bg-dark-600 bg-opacity-75 h-[100vh] ${
        fixed ? "fixed z-[250px]" : "absolute"
      } top-0 left-0 flex flex-col items-center justify-center z-[50] overflow-y-auto hideScollBar py-5`}
      data-name="main-modal"
    >
      <div className={`${isVisible ? "opacity-100" : "opacity-0"}`}>
        {showCloseIcon && (
          <div className="absolute top-10 right-0 p-1 z-[70]">
            {/* @ts-ignore */}
            <IconButton
              aria-label="close"
              className="mt-5 mr-5 bg-dark-405"
              bgColor={"rgb(18, 21, 26,.5)"}
              textColor="#fff"
              _hover={{ bg: "#20222C" }}
              icon={<IoClose />}
              onClick={onClose}
            />
          </div>
        )}
        <div className="relative w-full h-screen">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

export const ChildBlurModal = ({
  children,
  isOpen,
  showCloseIcon,
  onClose,
  fixed,
}: ModalProp) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const blurBg = `backdrop-blur-xl opacity-[1]`;
  const transBg = ``;

  React.useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleClickOutside = (e: Event) => {
    const tgt = (e.target as any)?.dataset;
    const name = tgt.name;
    name && onClose;
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.classList.remove("modal-open");
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`w-full backdrop-blur bg-black bg-opacity-75 h-[100vh] ${
        fixed ? "fixed z-[250px]" : "absolute"
      } top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center z-[50] overflow-y-auto hideScollBar py-5`}
      data-name="main-modal"
    >
      <div className={`${isVisible ? "opacity-100" : "opacity-0"}`}>
        {showCloseIcon && (
          <div className="absolute top-3 right-0 p-1 z-[70]">
            <IconButton
              aria-label="close"
              className="mt-5 mr-5 bg-dark-405"
              bgColor={"rgb(18, 21, 26,.5)"}
              textColor="#fff"
              _hover={{ bg: "#20222C" }}
              icon={<IoClose />}
              onClick={onClose}
            />
          </div>
        )}
        <div className="relative h-full">{children}</div>
      </div>
    </div>
  );
};
