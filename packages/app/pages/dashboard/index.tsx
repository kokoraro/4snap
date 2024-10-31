import React from "react";
import MainDashboardLayout from "../../components/Layout/mainDashboard";
import withAuth from "../../util/withAuth";

function Dashboard() {
  return (
    <MainDashboardLayout activeTab="dashboard">
      <p>welcome</p>
    </MainDashboardLayout>
  );
}

export default withAuth(Dashboard);
