import React, { useEffect } from "react";
import MainDashboardLayout from "../../components/Layout/mainDashboard";
import useIsReady from "../../hooks/useIsReady";
import { Spinner } from "../../components/Loader";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getUserInfo } from "../../http";
import { HandleUserResponse } from "../../util/response";
import serverPassageAuth from "../../util/serverPassageAuth";

export default function Dashboard({ isAuthorized }) {
  const isReady = useIsReady();
  const router = useRouter();
  const userInfoQuery = useQuery({
    queryFn: async () => await getUserInfo(),
    queryKey: ["getUserInfo"],
    enabled: isAuthorized,
  });

  if (!isAuthorized) {
    router.push("/auth");
  }

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

export async function getServerSideProps(context) {
  // getServerSideProps runs server-side only and will never execute on the client browser
  // this allows the safe use of a private Passage API Key
  return await serverPassageAuth(context);
}
