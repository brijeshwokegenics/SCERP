// frontend/components/CreateSchoolAdminForm.js

import { useState } from 'react';

/**
 * CreateSchoolAdminForm Component
 * Form for creating a new School Admin.
 *
 * @param {Function} onSubmit - Function to handle form submission.
 */
const CreateSchoolAdminForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    staffRole: '',
    schoolId: '',
  });

  /**
   * Handles input changes.
   *
   * @param {Object} e - Event object.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Handles form submission.
   *
   * @param {Object} e - Event object.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create School Admin
        </button>
      </div>
    </form>
  );
};

export default CreateSchoolAdminForm;
