import { useEffect } from "react";
import Router, { useRouter } from "next/router";
import isAuthenticated from "./isAuthenticated";

const withAuth = <P extends {}>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper: React.FC<P> = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("psg_auth_token");
      const isLoggedIn = isAuthenticated(token);
      if (!isLoggedIn) {
        router.push("/auth");
      }
    });

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
