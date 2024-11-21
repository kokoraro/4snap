import React, { useEffect } from "react";
import MainDashboardLayout from "../../components/Layout/mainDashboard";
import useIsReady from "../../hooks/useIsReady";
import { Spinner } from "../../components/Loader";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getUserInfo } from "../../http";
import { HandleUserResponse } from "../../util/response";
import isAuthenticated from "../../util/isAuthenticated";

export default function Dashboard({ isAuthorized }) {
  const isReady = useIsReady();
  const router = useRouter();
  const userInfoQuery = useQuery({
    queryFn: async () => await getUserInfo(),
    queryKey: ["getUserInfo"],
    enabled: isAuthorized,
  });

  useEffect(() => {
    const token = localStorage.getItem("psg_auth_token");
    const isAuthorized = isAuthenticated(token);
    if (!isAuthorized) {
      router.push("/auth");
    }
  });

  useEffect(() => {
    if (
      typeof userInfoQuery.data !== "undefined" ||
      userInfoQuery.error !== null
    ) {
      const { data } = userInfoQuery;
      const response = data;
      HandleUserResponse(
        response,
        () => {},
        (data) => {}
      );
    }
  }, [userInfoQuery.data]);

  return (
    <MainDashboardLayout activeTab="dashboard">
      {!isReady ? (
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <Spinner color="#3F7EEE" />
        </div>
      ) : (
        <div className="w-full">welcome</div>
      )}
    </MainDashboardLayout>
  );
}
