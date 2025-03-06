"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSchools,
  createSchool,
  updateSchool,
  deleteSchool,
} from "../../../store/schoolSlice";

const SchoolManagementPage = () => {
  const dispatch = useDispatch();
  const { list: schools, loading, error } = useSelector((state) => state.schools);

  // Local state for the school form fields
  const [form, setForm] = useState({
    name: "",
    address: "",
    contactNumber: "",
    email: "",
    website: "",
    principal: "",
    slogan: "",
    terms: "",
    conditions: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch schools on component mount
  useEffect(() => {
    dispatch(fetchSchools());
  }, [dispatch]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle form submission for create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await dispatch(updateSchool({ id: editingId, data: form }));
      setIsEditing(false);
      setEditingId(null);
    } else {
      await dispatch(createSchool(form));
    }
    setForm({
      name: "",
      address: "",
      contactNumber: "",
      email: "",
      website: "",
      principal: "",
      slogan: "",
      terms: "",
      conditions: "",
    });
  };

  // Load school data into the form for editing
  const handleEdit = (school) => {
    setForm({
      name: school.name,
      address: school.address,
      contactNumber: school.contactNumber,
      email: school.email,
      website: school.website,
      principal: school.principal,
      slogan: school.slogan,
      terms: school.terms,
      conditions: school.conditions,
    });
    setIsEditing(true);
    setEditingId(school._id);
  };

  // Delete a school record
  const handleDelete = (id) => {
    dispatch(deleteSchool(id));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">School Management</h1>

      {/* Form for Create / Update */}
      <div className="mb-8 bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          {isEditing ? "Update School Information" : "Create New School"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">School Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Principal</label>
            <input
              type="text"
              name="principal"
              value={form.principal}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Website</label>
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Slogan</label>
            <input
              type="text"
              name="slogan"
              value={form.slogan}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Terms</label>
            <textarea
              name="terms"
              value={form.terms}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700">Conditions</label>
            <textarea
              name="conditions"
              value={form.conditions}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            ></textarea>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isEditing ? "Update School" : "Create School"}
            </button>
          </div>
        </form>
      </div>

      {/* School List */}
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">School List</h2>
        {loading && <p className="text-center text-blue-600">Loading schools...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {schools.length > 0 ? (
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2">Name</th>
                <th className="border border-gray-200 px-4 py-2">Principal</th>
                <th className="border border-gray-200 px-4 py-2">Address</th>
                <th className="border border-gray-200 px-4 py-2">Contact</th>
                <th className="border border-gray-200 px-4 py-2">Email</th>
                <th className="border border-gray-200 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school) => (
                <tr key={school._id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">{school.name || "N/A"}</td>
                  <td className="border border-gray-200 px-4 py-2">{school.principal || "N/A"}</td>
                  <td className="border border-gray-200 px-4 py-2">{school.address || "N/A"}</td>
                  <td className="border border-gray-200 px-4 py-2">{school.contactNumber || "N/A"}</td>
                  <td className="border border-gray-200 px-4 py-2">{school.email || "N/A"}</td>
                  <td className="border border-gray-200 px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(school)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(school._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600">No schools found.</p>
        )}
      </div>
    </div>
  );
};

export default SchoolManagementPage;
