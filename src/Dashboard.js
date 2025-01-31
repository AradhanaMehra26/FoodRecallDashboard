import React from "react";
import RecallList from "./RecallList";

console.log("Dashboard component loaded");

const Dashboard = () => {
    return (
      <div className="dashboard-container">
        <RecallList />
      </div>
    );
  };

export default Dashboard;
