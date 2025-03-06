"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStudents } from "../../../../store/studentsSlice";
import { fetchSchools } from "@/store/schoolSlice";

export default function IDManagement() {
  const dispatch = useDispatch();
  const { list: students, loading, error } = useSelector((state) => state.students);
  const { list: schools } = useSelector((state) => state.schools);

  // Assume the current school info is the first in the schools array.
  const currentSchool = schools && schools.length > 0 ? schools[0] : {};

  // Filter states for class and admission number
  const [filterClass, setFilterClass] = useState("");
  const [filterAdmission, setFilterAdmission] = useState("");
  // State for selected student IDs (for bulk printing)
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  // Fetch students and schools on mount
  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchSchools());
  }, [dispatch]);
console.log(students)
  // Filter students by class and admission number (safe fallbacks applied)
  const filteredStudents = students.filter((student) => {
    const studentClass = (student.admissionClass || "").toLowerCase();
    const studentReg = (student.admissionNumber || "").toString().toLowerCase();
    const matchesClass = filterClass ? studentClass === filterClass.toLowerCase() : true;
    const matchesAdmission = filterAdmission
      ? studentReg.includes(filterAdmission.toLowerCase())
      : true;
    return matchesClass && matchesAdmission;
  });

  // Create a unique list of classes from student data
  const classes = [...new Set(students.map((student) => student.admissionClass || "N/A"))];

  // Toggle checkbox selection for bulk printing
  const handleCheckboxChange = (studentId) => {
    setSelectedStudentIds((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  // Function to print an individual student's ID card
  const handlePrint = (student) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print ID Card</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f0f0f0; display: flex; justify-content: center; align-items: center; }
            .id-card { width: 350px; height: auto; border: 1px solid #ccc; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
            .front, .back { padding: 10px; }
            .front { background: linear-gradient(to right, #3B82F6, #2563EB); color: white; }
            .back { background: #f0f0f0; color: #333; }
            .school-name { font-size: 20px; font-weight: bold; text-align: center; }
            .slogan { font-size: 12px; text-align: center; font-style: italic; margin-bottom: 5px; }
            .photo { width: 60px; height: 60px; border-radius: 50%; display: block; margin: 0 auto 5px; }
            .details p { margin: 3px 0; font-size: 12px; }
            .terms { font-size: 10px; margin-bottom: 5px; }
            .qr-code { width: 60px; height: 60px; display: block; margin: 5px auto; }
            .signature { font-size: 12px; text-align: right; margin-top: 5px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="id-card">
            <div class="front">
              <div class="school-name">${currentSchool.name || "N/A"}</div>
              <div class="slogan">${currentSchool.slogan || ""}</div>
              <img src="${student.photo || ""}" alt="Student Photo" class="photo" />
              <div class="details">
                <p><strong>Reg No:</strong> ${student.admissionNumber || "N/A"}</p>
                <p><strong>Student ID:</strong> ${student.studentID || "N/A"}</p>
                <p><strong>Name:</strong> ${(student.firstName || "") + " " + (student.lastName || "") || "N/A"}</p>
                <p><strong>Father/Guardian:</strong> ${student.fatherName || "N/A"}</p>
                <p><strong>Class:</strong> ${student.admissionClass || "N/A"}</p>
                <p><strong>Contact:</strong> ${student.mobileNumber || "N/A"}</p>
              </div>
            </div>
            <div class="back">
              <div class="terms">
                <strong>Terms &amp; Conditions</strong>
                <ul>
                  <li>${currentSchool.terms || ""}</li>
                  <li>${currentSchool.conditions || ""}</li>
                </ul>
              </div>
              <div class="details">
                <p><strong>Email:</strong> ${student.email || "N/A"}</p>
                <p><strong>Phone:</strong> ${student.mobileNumber || "N/A"}</p>
                <p><strong>Website:</strong> ${currentSchool.website || "N/A"}</p>
                <p><strong>Joined:</strong> ${student.admissionDate || "N/A"}</p>
              
              </div>
              <img src="${currentSchool.qrCode || ""}" alt="QR Code" class="qr-code" />
              <div class="signature">${currentSchool.principal || "Principal"}</div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Print bulk ID cards for selected students, arranged 6 per page.
  const handlePrintBulk = () => {
    const studentsToPrint = filteredStudents.filter((student) =>
      selectedStudentIds.includes(student.id || student._id)
    );
    if (studentsToPrint.length === 0) {
      alert("No students selected for bulk printing.");
      return;
    }
    const printWindow = window.open("", "_blank");
    let htmlContent = `
      <html>
        <head>
          <title>Print Bulk ID Cards</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; padding: 0; }
            .print-container {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
            }
            .id-card {
              width: 350px;
              height: auto;
              border: 1px solid #ccc;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 8px rgba(0,0,0,0.2);
              page-break-inside: avoid;
            }
            .front, .back { padding: 10px; }
            .front { background: linear-gradient(to right, #3B82F6, #2563EB); color: white; }
            .back { background: #f0f0f0; color: #333; }
            .school-name { font-size: 20px; font-weight: bold; text-align: center; }
            .slogan { font-size: 12px; text-align: center; font-style: italic; margin-bottom: 5px; }
            .photo { width: 60px; height: 60px; border-radius: 50%; display: block; margin: 0 auto 5px; }
            .details p { margin: 3px 0; font-size: 12px; }
            .terms { font-size: 10px; margin-bottom: 5px; }
            .qr-code { width: 60px; height: 60px; display: block; margin: 5px auto; }
            .signature { font-size: 12px; text-align: right; margin-top: 5px; font-weight: bold; }
            /* Force page break after every 6 cards */
            .id-card:nth-child(6n) {
              page-break-after: always;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
    `;
    studentsToPrint.forEach((student) => {
      htmlContent += `
        <div class="id-card">
          <div class="front">
            <div class="school-name">${currentSchool.name || "N/A"}</div>
            <div class="slogan">${currentSchool.slogan || ""}</div>
            <img src="${student.photo || ""}" alt="Student Photo" class="photo" />
            <div class="details">
              <p><strong>Reg No:</strong> ${student.admissionNumber || "N/A"}</p>
              <p><strong>Student ID:</strong> ${student.studentID || "N/A"}</p>
              <p><strong>Name:</strong> ${(student.firstName || "") + " " + (student.lastName || "") || "N/A"}</p>
              <p><strong>Father/Guardian:</strong> ${student.fatherName || "N/A"}</p>
              <p><strong>Class:</strong> ${student.admissionClass || "N/A"}</p>
              <p><strong>Contact:</strong> ${student.mobileNumber || "N/A"}</p>
            </div>
          </div>
          <div class="back">
            <div class="terms">
              <strong>Terms &amp; Conditions</strong>
              <ul>
                <li>The ID card is non-transferable.</li>
                <li>Report lost/damaged cards immediately.</li>
              </ul>
            </div>
            <div class="details">
              <p><strong>Email:</strong> ${student.email || "N/A"}</p>
              <p><strong>Phone:</strong> ${student.mobileNumber || "N/A"}</p>
              <p><strong>Website:</strong> ${student.website || "N/A"}</p>
              <p><strong>Joined:</strong> ${student.joinedDate || "N/A"}</p>
              <p><strong>Expiry:</strong> ${student.expiryDate || "N/A"}</p>
            </div>
            <img src="${student.qrCode || ""}" alt="QR Code" class="qr-code" />
            <div class="signature">${currentSchool.principal || "Principal"}</div>
          </div>
        </div>
      `;
    });
    htmlContent += `
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Admission Data &amp; Bulk Student ID Card Printing
        </h1>
        {loading && <p className="text-center text-blue-600">Loading data...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {/* Filter Options */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
          <div>
            <label className="block text-gray-600">Filter by Class:</label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              <option value="">All Classes</option>
              {classes.map((cls, index) => (
                <option key={index} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600">Filter by Admission No:</label>
            <input
              type="text"
              value={filterAdmission}
              onChange={(e) => setFilterAdmission(e.target.value)}
              placeholder="Enter Admission Number"
              className="border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* Table List with selectable rows */}
        {filteredStudents.length > 0 ? (
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2">Select</th>
                <th className="border border-gray-200 px-4 py-2">Admission No</th>
                <th className="border border-gray-200 px-4 py-2">Student Name</th>
                <th className="border border-gray-200 px-4 py-2">Class</th>
                <th className="border border-gray-200 px-4 py-2">Phone</th>
                <th className="border border-gray-200 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id || student._id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(student.id || student._id)}
                      onChange={() => handleCheckboxChange(student.id || student._id)}
                    />
                  </td>
                  <td className="border border-gray-200 px-4 py-2">{student.admissionNumber || "N/A"}</td>
                  <td className="border border-gray-200 px-4 py-2">
                    {(student.firstName || student.lastName)
                      ? `${student.firstName || ""} ${student.lastName || ""}`.trim()
                      : "N/A"}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">{student.admissionClass || "N/A"}</td>
                  <td className="border border-gray-200 px-4 py-2">{student.mobileNumber || "N/A"}</td>
                  <td className="border border-gray-200 px-4 py-2 space-x-2">
                    <button
                      onClick={() => handlePrint(student)}
                      className="text-green-500 hover:underline"
                    >
                      Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600 mt-4">
            No data found for the given filters.
          </p>
        )}

        {/* Bulk Print Button */}
        <div className="mt-4 text-center">
          <button
            onClick={handlePrintBulk}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Print Bulk ID Cards
          </button>
        </div>
      </div>
    </div>
  );
}
