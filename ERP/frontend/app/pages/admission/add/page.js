"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAdmission, selectMaxAdmissionNumber } from "../../../../store/admissionSlice";
import { useRouter } from "next/navigation";

// 1. Utility to trim date to "YYYY-MM-DD"
function toDateOnly(isoString = "") {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";
  // Convert to YYYY-MM-DD
  return date.toISOString().split("T")[0];
}

const AddAdmissionModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const maxAdmissionNumber = useSelector(selectMaxAdmissionNumber);

  const [formData, setFormData] = useState({
    admissionNumber: "",
    admissionDate: "",
    firstName: "",
    middleName: "",
    lastName: "",
    admissionClass: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    countryCode: "",
    mobileNumber: "",
    alternateMobileNumber: "",
    email: "",
    previousSchool: "",
    siblings: false,
    parentalStatus: "",
    fatherName: "",
    fatherDOB: "",
    fatherOccupation: "",
    motherName: "",
    motherDOB: "",
    motherOccupation: "",
  });

  // 2. Auto-generate the next admission number on mount
  useEffect(() => {
    if (maxAdmissionNumber !== undefined && maxAdmissionNumber !== null) {
      const nextAdmissionNumber = maxAdmissionNumber + 1;
      setFormData((prev) => ({
        ...prev,
        admissionNumber: String(nextAdmissionNumber),
      }));
    } else {
      // Fallback if there's no existing record
      setFormData((prev) => ({
        ...prev,
        admissionNumber: "1",
      }));
    }
  }, [maxAdmissionNumber]);

  // 3. Handle changes for all form fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 4. On submit, trim time from relevant date fields
  const handleSubmit = (e) => {
    e.preventDefault();

    // Make a copy of formData
    const trimmedData = { ...formData };

    // Trim time from date fields if they exist
    if (trimmedData.admissionDate) {
      trimmedData.admissionDate = toDateOnly(trimmedData.admissionDate);
    }
    if (trimmedData.dateOfBirth) {
      trimmedData.dateOfBirth = toDateOnly(trimmedData.dateOfBirth);
    }
    if (trimmedData.fatherDOB) {
      trimmedData.fatherDOB = toDateOnly(trimmedData.fatherDOB);
    }
    if (trimmedData.motherDOB) {
      trimmedData.motherDOB = toDateOnly(trimmedData.motherDOB);
    }

    // Dispatch the trimmed data
    dispatch(createAdmission(trimmedData));

    onClose();
    router.push("/pages/admission");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl relative shadow-lg overflow-y-auto max-h-screen">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>

        {/* Modal Header */}
        <h1 className="text-2xl font-bold mb-4">Add New Admission</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Admission Number (Read-only) */}
          <div>
            <label className="block mb-1">Admission Number</label>
            <input
              type="text"
              name="admissionNumber"
              value={formData.admissionNumber}
              onChange={handleChange}
              readOnly
              className="border rounded px-4 py-2 w-full bg-gray-200 cursor-not-allowed"
            />
          </div>

          {/* Admission Date */}
          <div>
            <label className="block mb-1">Admission Date</label>
            <input
              type="date"
              name="admissionDate"
              value={formData.admissionDate}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          {/* Middle Name */}
          <div>
            <label className="block mb-1">Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          {/* Admission Class */}
          <div>
            <label className="block mb-1">Admission Class</label>
            <input
              type="text"
              name="admissionClass"
              value={formData.admissionClass}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2 w-full"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          {/* City */}
          <div>
            <label className="block mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          {/* State */}
          <div>
            <label className="block mb-1">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          {/* ZIP Code */}
          <div>
            <label className="block mb-1">ZIP Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          {/* Country Code */}
          <div>
            <label className="block mb-1">Country Code</label>
            <input
              type="text"
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block mb-1">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          {/* Alternate Mobile Number */}
          <div>
            <label className="block mb-1">Alternate Mobile Number</label>
            <input
              type="text"
              name="alternateMobileNumber"
              value={formData.alternateMobileNumber}
              onChange={handleChange}
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          {/* Previous School */}
          <div>
            <label className="block mb-1">Previous School</label>
            <input
              type="text"
              name="previousSchool"
              value={formData.previousSchool}
              onChange={handleChange}
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          {/* Siblings */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="siblings"
              checked={formData.siblings}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-gray-700">Has Siblings</label>
          </div>

          {/* Parental Status */}
          <div>
            <label className="block mb-1">Parental Status</label>
            <input
              type="text"
              name="parentalStatus"
              value={formData.parentalStatus}
              onChange={handleChange}
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          {/* Father's Details */}
          <div>
            <label className="block mb-1">Father's Name</label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Father's Date of Birth</label>
            <input
              type="date"
              name="fatherDOB"
              value={formData.fatherDOB}
              onChange={handleChange}
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Father's Occupation</label>
            <input
              type="text"
              name="fatherOccupation"
              value={formData.fatherOccupation}
              onChange={handleChange}
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          {/* Mother's Details */}
          <div>
            <label className="block mb-1">Mother's Name</label>
            <input
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Mother's Date of Birth</label>
            <input
              type="date"
              name="motherDOB"
              value={formData.motherDOB}
              onChange={handleChange}
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Mother's Occupation</label>
            <input
              type="text"
              name="motherOccupation"
              value={formData.motherOccupation}
              onChange={handleChange}
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdmissionModal;
