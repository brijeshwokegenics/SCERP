// frontend/app/super-admin/create-school-admin/page.js

'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createSchoolAdmin, logout } from '../../../store/authSlice';

/**
 * CreateSchoolAdminPage Component
 * Allows SUPER_ADMIN to create a new School Admin.
 */
export default function CreateSchoolAdminPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { token, user, status, error } = useSelector((state) => state.auth);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    staffRole: '',
    schoolId: '',
  });

  // Protect route: only SUPER_ADMIN can access
  useEffect(() => {
    if (!token || !user) {
      router.replace('/login'); // Redirect to login if not authenticated
    } else if (user.role !== 'SUPER_ADMIN') {
      router.replace('/'); // Redirect to home if not Super Admin
    }
  }, [token, user, router]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(createSchoolAdmin(formData)).unwrap();
      alert('School Admin created successfully!');
      router.push('/super-admin/manage-school-admins'); // Redirect to manage page
    } catch (err) {
      console.error('Failed to create School Admin:', err);
      alert(`Error: ${err.message || 'Failed to create School Admin'}`);
    }
  };

  // Show a loading state while authenticating
  if (!token || !user) {
    return <p>Redirecting...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create School Admin</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Staff Role */}
        <div>
          <label htmlFor="staffRole" className="block text-sm font-medium text-gray-700">
            Staff Role
          </label>
          <input
            type="text"
            name="staffRole"
            id="staffRole"
            required
            value={formData.staffRole}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* School ID */}
        <div>
          <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700">
            School ID
          </label>
          <input
            type="text"
            name="schoolId"
            id="schoolId"
            required
            value={formData.schoolId}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create School Admin
          </button>
        </div>
      </form>

      {/* Optionally, display status or error messages */}
      {status === 'loading' && <p>Creating School Admin...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
    </div>
  );
}
