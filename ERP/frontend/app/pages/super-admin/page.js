"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSchoolAdmins,
  updateSchoolAdmin,
  deleteSchoolAdmin,
} from "../../../store/authSlice";

const SchoolAdmin = () => {
  const dispatch = useDispatch();
  const { schoolAdmins, status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchSchoolAdmins());
  }, [dispatch]);

  const handleEnableDisable = (adminId, isActive) => {
    dispatch(updateSchoolAdmin({ adminId, updates: { isActive: !isActive } }));
  };

  const handleDelete = (adminId) => {
    if (confirm("Are you sure you want to delete this admin?")) {
      dispatch(deleteSchoolAdmin(adminId));
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">School Admins</h1>
      <table className="table-auto w-full border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schoolAdmins.map((admin) => (
            <tr key={admin.id}>
              <td className="px-4 py-2 border">{admin.name}</td>
              <td className="px-4 py-2 border">{admin.email}</td>
              <td className="px-4 py-2 border">
                {admin.isActive ? "Active" : "Disabled"}
              </td>
              <td className="px-4 py-2 border">
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                  onClick={() => handleEnableDisable(admin.id, admin.isActive)}
                >
                  {admin.isActive ? "Disable" : "Enable"}
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(admin.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchoolAdmin;
