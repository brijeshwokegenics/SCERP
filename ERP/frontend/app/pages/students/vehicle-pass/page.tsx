"use client";

import { useState } from "react";

export default function VehiclePass() {
  const [vehiclePasses, setVehiclePasses] = useState([]);
  const [form, setForm] = useState({
    id: "",
    studentName: "",
    vehicleNumber: "",
    destination: "",
    timeLeaving: "",
    timeReturning: "",
    teacherLeaving: "",
    teacherReturning: "",
    date: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isListVisible, setIsListVisible] = useState(false);
  const [selectedPasses, setSelectedPasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setVehiclePasses((prev) =>
        prev.map((pass) => (pass.id === form.id ? form : pass))
      );
      setIsEditing(false);
    } else {
      setVehiclePasses((prev) => [
        ...prev,
        { ...form, id: Date.now().toString() },
      ]);
    }
    setForm({
      id: "",
      studentName: "",
      vehicleNumber: "",
      destination: "",
      timeLeaving: "",
      timeReturning: "",
      teacherLeaving: "",
      teacherReturning: "",
      date: "",
    });
  };

  const handleEdit = (id) => {
    const pass = vehiclePasses.find((pass) => pass.id === id);
    setForm(pass);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setVehiclePasses((prev) => prev.filter((pass) => pass.id !== id));
  };

  const handleToggleList = () => {
    setIsListVisible((prev) => !prev);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPasses(vehiclePasses.map((pass) => pass.id));
    } else {
      setSelectedPasses([]);
    }
  };

  const handleSelect = (id) => {
    setSelectedPasses((prev) =>
      prev.includes(id) ? prev.filter((passId) => passId !== id) : [...prev, id]
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPasses = vehiclePasses.filter(
    (pass) =>
      pass.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pass.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pass.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredPasses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredPasses.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrint = () => {
    const selected = vehiclePasses.filter((pass) =>
      selectedPasses.includes(pass.id)
    );

    const printContent = selected
      .map(
        (pass) => `
        <div style="border: 2px solid black; margin-bottom: 20px; padding: 10px; font-family: Arial, sans-serif; width:320px;">
          <h3 style="text-align: center;">Vehicle Pass</h3>
          <p><strong>Student's Name:</strong> ${pass.studentName}</p>
          <p><strong>Vehicle Number:</strong> ${pass.vehicleNumber}</p>
          <p><strong>Destination:</strong> ${pass.destination}</p>
          <p><strong>Time Leaving:</strong> ${pass.timeLeaving} (Teacher: ${pass.teacherLeaving})</p>
          <p><strong>Time Returning:</strong> ${pass.timeReturning} (Teacher: ${pass.teacherReturning})</p>
          <p><strong>Date:</strong> ${pass.date}</p>
        </div>
      `
      )
      .join("");

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Vehicle Passes</title>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Vehicle Pass</h1>

        {/* Toggle List */}
        <button
          onClick={handleToggleList}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        >
          {isListVisible ? "Hide List" : "View List"}
        </button>

        {/* Form */}
        {!isListVisible && (
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label className="block text-gray-600">Student's Name</label>
              <input
                type="text"
                name="studentName"
                value={form.studentName}
                onChange={handleInputChange}
                className="border w-full px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">Vehicle Number</label>
              <input
                type="text"
                name="vehicleNumber"
                value={form.vehicleNumber}
                onChange={handleInputChange}
                className="border w-full px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">Destination</label>
              <input
                type="text"
                name="destination"
                value={form.destination}
                onChange={handleInputChange}
                className="border w-full px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-600">Time Leaving</label>
                <input
                  type="time"
                  name="timeLeaving"
                  value={form.timeLeaving}
                  onChange={handleInputChange}
                  className="border w-full px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600">Teacher (Leaving)</label>
                <input
                  type="text"
                  name="teacherLeaving"
                  value={form.teacherLeaving}
                  onChange={handleInputChange}
                  className="border w-full px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-600">Time Returning</label>
                <input
                  type="time"
                  name="timeReturning"
                  value={form.timeReturning}
                  onChange={handleInputChange}
                  className="border w-full px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600">Teacher (Returning)</label>
                <input
                  type="text"
                  name="teacherReturning"
                  value={form.teacherReturning}
                  onChange={handleInputChange}
                  className="border w-full px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleInputChange}
                className="border w-full px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <button
              type="submit"
              className={`px-4 py-2 rounded ${
                isEditing
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              {isEditing ? "Update Pass" : "Create Pass"}
            </button>
          </form>
        )}

        {/* List View */}
        {isListVisible && (
          <div>
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="border w-full px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            {/* Table */}
            <table className="w-full table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-4 py-2">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        selectedPasses.length === vehiclePasses.length &&
                        vehiclePasses.length > 0
                      }
                    />
                  </th>
                  <th className="border border-gray-200 px-4 py-2">Student Name</th>
                  <th className="border border-gray-200 px-4 py-2">Vehicle Number</th>
                  <th className="border border-gray-200 px-4 py-2">Destination</th>
                  <th className="border border-gray-200 px-4 py-2">Time Leaving</th>
                  <th className="border border-gray-200 px-4 py-2">Time Returning</th>
                  <th className="border border-gray-200 px-4 py-2">Date</th>
                  <th className="border border-gray-200 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((pass) => (
                  <tr key={pass.id}>
                    <td className="border border-gray-200 px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedPasses.includes(pass.id)}
                        onChange={() => handleSelect(pass.id)}
                      />
                    </td>
                    <td className="border border-gray-200 px-4 py-2">{pass.studentName}</td>
                    <td className="border border-gray-200 px-4 py-2">{pass.vehicleNumber}</td>
                    <td className="border border-gray-200 px-4 py-2">{pass.destination}</td>
                    <td className="border border-gray-200 px-4 py-2">{pass.timeLeaving}</td>
                    <td className="border border-gray-200 px-4 py-2">{pass.timeReturning}</td>
                    <td className="border border-gray-200 px-4 py-2">{pass.date}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      <button
                        onClick={() => handleEdit(pass.id)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pass.id)}
                        className="text-red-500 hover:underline ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Print Button */}
            {selectedPasses.length > 0 && (
              <button
                onClick={handlePrint}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Print Selected
              </button>
            )}

            {/* Pagination */}
            <div className="mt-4 flex justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
