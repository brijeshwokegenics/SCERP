// frontend/components/StaffList.js

import React from "react";
import { useDispatch } from "react-redux";
import { updateStaff, deleteStaff } from "../../store/authSlice";

const StaffList = ({ staff }) => {
  const dispatch = useDispatch();

  const handleToggleActive = async (staffId, currentStatus) => {
    const updates = { isActive: !currentStatus };
    await dispatch(updateStaff({ staffId, updates }));
  };

  const handleDeleteStaff = async (staffId) => {
    if (confirm("Are you sure you want to delete this Staff member? This action cannot be undone.")) {
      await dispatch(deleteStaff(staffId));
    }
  };

  return (
    <table className="min-w-full bg-white border mt-8">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">Email</th>
          <th className="py-2 px-4 border-b">First Name</th>
          <th className="py-2 px-4 border-b">Last Name</th>
          <th className="py-2 px-4 border-b">Staff Role</th>
          <th className="py-2 px-4 border-b">Status</th>
          <th className="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        {staff.map((s) => (
          <tr key={s._id}>
            <td className="py-2 px-4 border-b">{s.email}</td>
            <td className="py-2 px-4 border-b">{s.firstName}</td>
            <td className="py-2 px-4 border-b">{s.lastName}</td>
            <td className="py-2 px-4 border-b">{s.staffRole}</td>
            <td className="py-2 px-4 border-b">
              {s.isActive ? "Active" : "Disabled"}
            </td>
            <td className="py-2 px-4 border-b">
              <button
                className={`px-2 py-1 mr-2 rounded ${
                  s.isActive ? "bg-yellow-500 text-white" : "bg-green-500 text-white"
                }`}
                onClick={() => handleToggleActive(s._id, s.isActive)}
              >
                {s.isActive ? "Disable" : "Enable"}
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDeleteStaff(s._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StaffList;
