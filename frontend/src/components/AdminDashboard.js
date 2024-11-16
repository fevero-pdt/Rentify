import React from "react";

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        <li><a href="/admin/users">Manage Users</a></li>
        <li><a href="/admin/reports">View Reports</a></li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
