"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  fetchAdmissions,
  deleteAdmission,
  createAdmission, updateAdmission,
  selectMaxAdmissionNumber,
} from "../../../store/admissionSlice";

function toDateOnly(isoString = "") {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

export default function AdmissionsPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { admissions, status, error } = useSelector((state) => state.admissions);
  const { token } = useSelector((state) => state.auth);
  const maxAdmissionNumber = useSelector(selectMaxAdmissionNumber);

  const [searchTerm, setSearchTerm] = useState("");
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
  const [tab, setTab] = useState("list");
  const isEditing = tab === "edit";
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchAdmissions());
    } else {
      router.push("/");
    }
  }, [dispatch, token, router]);

  useEffect(() => {
    if (maxAdmissionNumber !== undefined && maxAdmissionNumber !== null && !editId) {
      setFormData((prev) => ({
        ...prev,
        admissionNumber: String(maxAdmissionNumber + 1),
      }));
    } else if (!editId) {
      setFormData((prev) => ({ ...prev, admissionNumber: "1" }));
    }
  }, [maxAdmissionNumber, editId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (admission) => {
    // Switch to edit mode without switching tab
    setTab("edit");
    setFormData({
      ...admission,
      admissionDate: toDateOnly(admission.admissionDate),
      dateOfBirth: toDateOnly(admission.dateOfBirth),
      fatherDOB: toDateOnly(admission.fatherDOB),
      motherDOB: toDateOnly(admission.motherDOB),
    });
    setEditId(admission._id);
    // no tab switch on edit
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      "admissionDate", "firstName", "lastName", "admissionClass",
      "dateOfBirth", "gender", "address", "city", "state",
      "zipCode", "countryCode", "mobileNumber", "fatherName",
      "fatherDOB", "motherName", "motherDOB"
    ];

    for (let field of requiredFields) {
      if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
        alert(`${field.replace(/([A-Z])/g, ' $1')} is required.`);
        return;
      }
    }

    const phonePattern = /^\d{10,15}$/;
    if (!phonePattern.test(formData.mobileNumber)) {
      alert("Please enter a valid Mobile Number (10-15 digits).");
      return;
    }
    if (formData.alternateMobileNumber && !phonePattern.test(formData.alternateMobileNumber)) {
      alert("Please enter a valid Alternate Mobile Number (10-15 digits).");
      return;
    }

    const emailPattern = /.+@.+\..+/;
    if (formData.email && !emailPattern.test(formData.email)) {
      alert("Please enter a valid Email Address.");
      return;
    }

    const trimmedData = { ...formData };
    ["admissionDate", "dateOfBirth", "fatherDOB", "motherDOB"].forEach((key) => {
      if (trimmedData[key]) trimmedData[key] = toDateOnly(trimmedData[key]);
    });

    if (editId) {
      dispatch(updateAdmission({ id: editId, updatedData: trimmedData }));
    } else {
      dispatch(createAdmission(trimmedData));
      setFormData({
        admissionNumber: String(Number(formData.admissionNumber) + 1),
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
    }
    setEditId(null);
    setFormData({
      admissionNumber: String(Number(formData.admissionNumber) + 1),
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
    setTab("list");
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this admission?")) {
      dispatch(deleteAdmission(id));
    }
  };

  const filteredAdmissions = searchTerm.trim()
    ? admissions.filter((admission) => {
        const fullName = `${admission.firstName} ${admission.lastName}`.toLowerCase();
        const classMatch = admission.admissionClass.toLowerCase().includes(searchTerm.toLowerCase());
        const admissionNumberMatch = admission.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
        return (
          admission.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admission.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fullName.includes(searchTerm.toLowerCase()) ||
          classMatch ||
          admissionNumberMatch
        );
      })
    : admissions;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admissions</h1>

      {/* Tab Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${tab === "list" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("list")}
        >
          Admission List
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "add" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          onClick={() => {
            setEditId(null);
            setFormData({
              admissionNumber: String(Number(maxAdmissionNumber) + 1),
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
            setTab("add");
          }}
        >
          Add Admission
        </button>
      </div>

      {tab === "list" && (
        <>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 border rounded px-4 py-2 w-full"
          />

          {status === "loading" && <p>Loading admissions...</p>}
          {status === "failed" && <p className="text-red-500">Error: {error}</p>}

          {filteredAdmissions.length > 0 ? (
            <table className="min-w-full border border-gray-200 mb-8">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Admission Number</th>
                  <th className="border px-4 py-2 text-left">Name</th>
                  <th className="border px-4 py-2 text-left">Class</th>
                  <th className="border px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmissions.map((admission) => (
                  <tr key={admission._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{admission.admissionNumber}</td>
                    <td className="border px-4 py-2">{`${admission.firstName} ${admission.lastName}`}</td>
                    <td className="border px-4 py-2">{admission.admissionClass}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(admission)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(admission._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center">No admissions found.</p>
          )}
        </>
      )}

      {(tab === "add" || tab === "edit") && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(formData).map(([key, value]) => (
            typeof value === "boolean" ? (
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  name={key}
                  checked={value}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-gray-700 capitalize">{key}</label>
              </div>
            ) : key === "gender" ? (
              <div key={key}>
                <label className="block mb-1 capitalize">{key}</label>
                <select
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            ) : (
              <div key={key}>
                <label className="block mb-1 capitalize">{key}</label>
                <input
                  type={key === "fatherDOB" || key === "motherDOB" || key === "dateOfBirth" || key === "admissionDate" ? "date" : key.toLowerCase().includes("email") ? "email" : "text"}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full"
                />
              </div>
            )
          ))}
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            {isEditing ? "Update" : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
}
