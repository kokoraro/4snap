import Link from "next/link";
import { useEffect } from "react";
import ImageTag from "../../components/Image";
import ENV from "../api/config/env";

function Login() {
  useEffect(() => {
    require("@passageidentity/passage-elements/passage-auth");
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-dark-100 pattern-bg ">
      <div className="w-full px-4 py-3 flex items-center justify-between absolute top-0 left-0 z-[10]">
        <Link
          href="/"
          className="w-auto z-[10] cursor-pointer flex items-center justify-center gap-2"
        >
          <ImageTag src="/logo.png" className="w-[30%] " />
          <p className="text-white-100 pp-EB text-[20px] ">4Snap</p>
        </Link>
      </div>
      <div className="w-full max-w-[400px] bg-dark-300 border-solid border-[2px] border-white-600 pp-SB z-[10] rounded-[10px] ">
        <passage-auth app-id={ENV.passageAppId}></passage-auth>
      </div>
    </div>
  );
}
export default Login;
