import next from "next";
import SideBar from "../Navbar/sidebar";
import TopBar from "../Navbar/topbar";

interface DashboardLayoutProp {
  children: React.ReactNode;
  activeTab: string;
}

function MainDashboardLayout({ children, activeTab }: DashboardLayoutProp) {
  return (
    <div className="w-full h-full">
      <TopBar />
      <div className="w-full h-full py-9 flex items-start justify-start overflowHidden">
        <SideBar active={activeTab} />
        <div className="relative w-[100%] h-[100vh] overflow-y-scroll hideScrollbar1 py-7">
          {children}
        </div>
      </div>
    </div>
  );
}

export default MainDashboardLayout;
