import React, { useEffect, useState } from "react";

interface LoaderModalProp {
  showLabel?: boolean;
  position?: "absolute" | "fixed";
}

interface SpinnerCompProp {
  color?: string;
  size?: number;
}

export function LoaderModal({ showLabel, position }: LoaderModalProp) {
  const validPosition = position === "absolute" ? "absolute" : "fixed";
  return (
    <div
      className={`w-full backdrop-blur bg-opacity-85 h-[100vh] ${validPosition} top-0 left-0 right-0 bottom-0 z-[150] hideScollBar flex flex-col items-center justify-center`}
      data-name="main-modal"
    >
      <Spinner />
      {showLabel && <p className="text-white-200 mt-3 text-1xl ">Loading...</p>}
    </div>
  );
}

export function Spinner({ size, color }: SpinnerCompProp) {
  const Size =
    typeof size === "undefined"
      ? " w-[25px] h-[25px] "
      : ` w-[${size}px] h-[${size}px] `;

  const Color =
    typeof color === "undefined"
      ? "border-t-blue-200 border-r-transparent border-l-blue-200 border-b-transparent"
      : `border-[${color}] border-r-transparent border-b-transparent`;

  return (
    <div
      id="showccial-spinner"
      className={`rounded-[50%] ${Size} border-[4px] ${Color} z-[100] `}
    ></div>
  );
}
