import { useEffect } from "react";

function Login() {
  useEffect(() => {
    require("@passageidentity/passage-elements/passage-auth");
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white-100 ">
      <div className="w-full max-w-[400px] bg-white-300 border-solid border-[2px] border-white-600 pp-SB ">
        <passage-auth app-id="Wk5nQ0hQ9KfcNaTv5kZlAkWt"></passage-auth>
      </div>
    </div>
  );
}
export default Login;
