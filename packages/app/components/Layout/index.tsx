import React from "react";

interface LayoutProps {
  children?: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="w-full relative h-[100vh] overflow-y-auto bg-dark-100">
      {children}
      <div className="w-full absolute top-9"></div>
    </div>
  );
}

export default Layout;
