// pages/students/[id].js
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentDetails } from '../../../store/studentsSlice';
import Link from 'next/link';


export default function StudentDetailsPage() {


  const router = useRouter();
  const { id } = router.query; // Extract student ID from the URL

  const dispatch = useDispatch();
  const { currentStudent, loading, error } = useSelector((state) => state.students);

  useEffect(() => {
    if (id) {
      dispatch(fetchStudentDetails(id));
    }
  }, [id, dispatch]);

  // Helper function to render error messages
  const renderError = (err) => {
    if (!err) return null;
    if (typeof err === 'object') {
      return err.message ? `Error: ${err.message}` : JSON.stringify(err);
    }
    return `Error: ${err}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Link */}
      <Link href="/students">
        <a className="text-blue-600 hover:underline">&larr; Back to Students List</a>
      </Link>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-blue-600 mt-4">Loading student details...</p>
      )}

      {/* Error State */}
      {error && (
        <p className="text-center text-red-600 mt-4">{renderError(error)}</p>
      )}

      {/* Student Details */}
      {!loading && !error && currentStudent && (
        <div className="mt-6 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-4">
            {currentStudent.firstName} {currentStudent.lastName}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Admission Details */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Admission Details</h3>
              <ul className="list-none">
                <li className="mb-1">
                  <span className="font-medium">Admission Number:</span>{' '}
                  {currentStudent.admissionNumber}
                </li>
                <li className="mb-1">
                  <span className="font-medium">Class:</span>{' '}
                  {currentStudent.admissionClass}
                </li>
                <li className="mb-1">
                  <span className="font-medium">Enrollment Date:</span>{' '}
                  {new Date(currentStudent.enrollmentDate).toLocaleDateString()}
                </li>
              </ul>
            </div>

            {/* Contact Details */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Contact Details</h3>
              <ul className="list-none">
                <li className="mb-1">
                  <span className="font-medium">Mobile Number:</span>{' '}
                  {currentStudent.mobileNumber}
                </li>
                <li className="mb-1">
                  <span className="font-medium">Email:</span>{' '}
                  {currentStudent.email}
                </li>
                <li className="mb-1">
                  <span className="font-medium">Address:</span>{' '}
                  {currentStudent.address}
                </li>
              </ul>
            </div>

            {/* Parent Details */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Parent Details</h3>
              <ul className="list-none">
                <li className="mb-1">
                  <span className="font-medium">Father's Name:</span>{' '}
                  {currentStudent.fatherName}
                </li>
                <li className="mb-1">
                  <span className="font-medium">Mother's Name:</span>{' '}
                  {currentStudent.motherName}
                </li>
                <li className="mb-1">
                  <span className="font-medium">Guardian's Name:</span>{' '}
                  {currentStudent.guardianName || 'N/A'}
                </li>
              </ul>
            </div>

            {/* Additional Details */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Additional Details</h3>
              <ul className="list-none">
                <li className="mb-1">
                  <span className="font-medium">Date of Birth:</span>{' '}
                  {new Date(currentStudent.dateOfBirth).toLocaleDateString()}
                </li>
                <li className="mb-1">
                  <span className="font-medium">Gender:</span>{' '}
                  {currentStudent.gender}
                </li>
                <li className="mb-1">
                  <span className="font-medium">Blood Group:</span>{' '}
                  {currentStudent.bloodGroup || 'N/A'}
                </li>
                <li className="mb-1">
                  <span className="font-medium">Nationality:</span>{' '}
                  {currentStudent.nationality || 'N/A'}
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-4">
            <Link href={`/students/${currentStudent._id}/edit`}>
              <a className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
                Edit Details
              </a>
            </Link>
            <Link href={`/students/${currentStudent._id}/delete`}>
              <a className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Delete Student
              </a>
            </Link>
          </div>
        </div>
      )}

      {/* No Student Found */}
      {!loading && !error && !currentStudent && (
        <p className="text-center text-gray-600 mt-4">Student not found.</p>
      )}
    </div>
  );
}
