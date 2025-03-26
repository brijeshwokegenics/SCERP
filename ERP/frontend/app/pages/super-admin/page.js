'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSchoolAdmins,
  createSchoolAdmin,
  updateSchoolAdmin,
  deleteSchoolAdmin,
} from '../../../store/authSlice';

export default function SchoolAdminPage() {
  const dispatch = useDispatch();

  const {
    schoolAdmins,
    schoolAdminsStatus,
    schoolAdminsError,
    totalSchoolAdmins,
  } = useSelector((state) => state.auth);

  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    schoolId: '',
  });

  // ✅ Updated: Fetch admins only after token + auth is ready
  useEffect(() => {
    if (token && isAuthenticated) {
      dispatch(fetchSchoolAdmins({ page: 1, limit: 10 }));
    }
  }, [token, isAuthenticated, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(createSchoolAdmin(formData));
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      schoolId: '',
    });
  };

  const toggleStatus = (adminId, isActive) => {
    dispatch(updateSchoolAdmin({ adminId, isActive: !isActive }));
  };

  const handleDelete = (adminId) => {
    if (confirm('Are you sure you want to delete this admin?')) {
      dispatch(deleteSchoolAdmin(adminId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-800">
          School Admin Management
        </h1>

        {/* Create Admin Form */}
        <div className="bg-white shadow-md rounded p-6 mb-8">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              name="password"
              placeholder="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="schoolId"
              placeholder="School ID"
              value={formData.schoolId}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <div className="col-span-full">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Create Admin
              </button>
            </div>
          </form>
        </div>

        {/* Admins List */}
        {schoolAdminsStatus === 'loading' && (
          <p className="text-center text-gray-600">Loading...</p>
        )}
        {schoolAdminsError && (
          <p className="text-red-600 text-center">{schoolAdminsError}</p>
        )}

        <div className="grid gap-6">
          {Array.isArray(schoolAdmins) && schoolAdmins.length > 0 ? (
            schoolAdmins.map(
              (admin) =>
                admin &&
                admin.email && (
                  <div
                    key={admin._id}
                    className="bg-white shadow-md rounded p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-lg font-semibold text-blue-800">
                        {admin.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        {admin.firstName} {admin.lastName} | School ID:{' '}
                        {admin.schoolId}
                      </p>
                      <p className="text-sm mt-1">
                        Status:{' '}
                        <span
                          className={
                            admin.isActive
                              ? 'text-green-600 font-semibold'
                              : 'text-red-600 font-semibold'
                          }
                        >
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          toggleStatus(admin._id, admin.isActive)
                        }
                        className="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        {admin.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
            )
          ) : (
            <p className="text-center text-gray-500">No admins found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
