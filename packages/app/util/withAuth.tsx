import { useEffect } from "react";
import Router, { useRouter } from "next/router";
import isAuthenticated from "./isAuthenticated";

const withAuth = <P extends {}>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper: React.FC<P> = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("authToken");
      // const isLoggedIn = isAuthenticated(token);
      const isLoggedIn = true;
      if (!isLoggedIn) {
        router.push("/auth/login");
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
