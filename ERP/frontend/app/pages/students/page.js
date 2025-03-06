"use client";
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStudents } from '../../../store/studentsSlice';
import Link from 'next/link';

export default function StudentsList() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.students);

  // State for modal visibility and selected student
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // Helper: Format date strings by trimming time portion if present.
  const formatValue = (val) => {
    if (typeof val === 'string' && val.includes('T')) {
      return val.split('T')[0];
    }
    return val;
  };

  // Open modal with the selected student
  const openModal = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  // Close the modal and reset selected student
  const closeModal = () => {
    setModalOpen(false);
    setSelectedStudent(null);
  };

  // Helper function to render error (handles object or string)
  const renderError = (err) => {
    if (!err) return null;
    if (typeof err === 'object') {
      return err.message ? `Error: ${err.message}` : JSON.stringify(err);
    }
    return `Error: ${err}`;
  };

  if (loading) {
    return <p className="text-center text-blue-600 mt-4">Loading students...</p>;
  }
  if (error) {
    return <p className="text-center text-red-600 mt-4">{renderError(error)}</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Students List</h2>

      {/* Students Table */}
      {!loading && !error && list.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Admission Number
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Class
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Contact Number
                </th>
                <th className="py-3 px-6 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((student) => (
                <tr
                  key={student._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-4 px-6 text-sm text-gray-700">
                    {student.admissionNumber}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700">
                    {student.firstName} {student.lastName}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700">
                    {student.admissionClass}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700">
                    {student.mobileNumber}
                  </td>
                  <td className="py-4 px-6 text-sm text-center">
                    <button
                      onClick={() => openModal(student)}
                      className="inline-block px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No Students Found */}
      {!loading && !error && list.length === 0 && (
        <p className="text-center text-gray-600 mt-4">No students found.</p>
      )}

      {/* Additional links for ID cards and vehicle passes */}
      <div className="flex space-x-4 mt-6">
        <Link
          href="/students/generate-idcard"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generate ID Cards
        </Link>
        <Link
          href="/students/generate-pass"
          className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Generate Vehicle Pass
        </Link>
      </div>

      {/* Modal for Student Details */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full relative overflow-auto max-h-screen shadow-lg">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-center">Student Details</h3>

            {/* Group student fields into sections */}
            {(() => {
              // Define field-to-section mapping
              const fieldSections = {
                firstName: "Personal Information",
                lastName: "Personal Information",
                gender: "Personal Information",
                dateOfBirth: "Personal Information",
                admissionNumber: "Academic Information",
                admissionClass: "Academic Information",
                mobileNumber: "Contact Information",
                email: "Contact Information",
                address: "Contact Information",
              };

              const groupedData = {};

              Object.entries(selectedStudent).forEach(([key, value]) => {
                if (key === 'user' || key === '__v') return;
                const section = fieldSections[key] || "Additional Information";
                if (!groupedData[section]) {
                  groupedData[section] = [];
                }
                groupedData[section].push({ key, value });
              });

              // Define a section order for consistent display
              const sectionOrder = [
                "Personal Information",
                "Academic Information",
                "Contact Information",
                "Additional Information",
              ];

              return sectionOrder.map((sectionName) => {
                const fields = groupedData[sectionName];
                if (!fields) return null;
                return (
                  <div key={sectionName} className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-700 border-b pb-1 mb-2">
                      {sectionName}
                    </h4>
                    <div className="space-y-2">
                      {fields.map(({ key, value }) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium text-gray-600 capitalize">{key}</span>
                          <span className="text-gray-800 break-all ml-2">
                            {value && typeof value === 'object'
                              ? JSON.stringify(value)
                              : formatValue(String(value))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
