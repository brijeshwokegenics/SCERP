"use client";
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStudents } from '../../../store/studentsSlice';
import Link from 'next/link';

export default function StudentsList() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.students);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const formatValue = (val) => {
    if (typeof val === 'string' && val.includes('T')) {
      return val.split('T')[0];
    }
    return val;
  };

  const openModal = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedStudent(null);
  };

  const renderError = (err) => {
    if (!err) return null;
    return typeof err === 'object' ? err.message || JSON.stringify(err) : `Error: ${err}`;
  };

  if (loading) return <p className="text-center text-blue-600 mt-4">Loading students...</p>;
  if (error) return <p className="text-center text-red-600 mt-4">{renderError(error)}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-6 text-center">Students List</h2>

      {list.length > 0 && (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="py-3 px-6 text-left">Admission No</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Class</th>
                <th className="py-3 px-6 text-left">Mobile</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((student) => (
                <tr key={student._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{student.admissionNumber}</td>
                  <td className="px-6 py-4">{student.firstName} {student.lastName}</td>
                  <td className="px-6 py-4">{student.admissionClass}</td>
                  <td className="px-6 py-4">{student.mobileNumber}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => openModal(student)}
                      className="bg-indigo-600 text-white text-sm px-4 py-1 rounded hover:bg-indigo-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {list.length === 0 && <p className="text-center text-gray-600">No students found.</p>}

      <div className="flex justify-center gap-6 mt-6">
        <Link href="/students/generate-idcard" className="px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">
          Generate ID Cards
        </Link>
        <Link href="/students/generate-pass" className="px-5 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700">
          Generate Vehicle Pass
        </Link>
      </div>

      {isModalOpen && selectedStudent && (
        <div className="absolute w-75 m-6 top-64 right-0 left-64 inset-0  items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm overflow-scroll">
          <div className="relative bg-white   p-6 shadow-lg animate-fadeIn ">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>

            <h3 className="text-2xl font-semibold text-center mb-4">Student Details</h3>

            {(() => {
              const fieldSections = {
                firstName: "Personal Info",
                lastName: "Personal Info",
                gender: "Personal Info",
                dateOfBirth: "Personal Info",
                admissionNumber: "Academic Info",
                admissionClass: "Academic Info",
                mobileNumber: "Contact Info",
                email: "Contact Info",
                address: "Contact Info",
              };

              const groupedData = {};
              Object.entries(selectedStudent).forEach(([key, value]) => {
                if (key === 'user' || key === '__v') return;
                const section = fieldSections[key] || "Other";
                groupedData[section] = groupedData[section] || [];
                groupedData[section].push({ key, value });
              });

              return Object.entries(groupedData).map(([section, fields]) => (
                <div key={section} className="mb-4">
                  <h4 className="text-lg font-medium text-gray-700 border-b pb-1 mb-2">{section}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {fields.map(({ key, value }) => (
                      <div key={key}>
                        <div className="text-sm font-medium text-gray-500 capitalize">{key}</div>
                        <div className="text-sm text-gray-800">{value && typeof value === 'object' ? JSON.stringify(value) : formatValue(String(value))}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
