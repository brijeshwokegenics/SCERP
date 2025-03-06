"use client";

import { useState } from "react";

export default function AdmitCard() {
  const [admitCards, setAdmitCards] = useState([]);
  const [form, setForm] = useState({
    id: "",
    schoolName: "",
    issuedDate: "",
    studentName: "",
    fatherName: "",
    class: "",
    section: "",
    examType: "Final Exam", // Default exam type
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isListVisible, setIsListVisible] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
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
      setAdmitCards((prev) =>
        prev.map((card) => (card.id === form.id ? form : card))
      );
      setIsEditing(false);
    } else {
      setAdmitCards((prev) => [
        ...prev,
        { ...form, id: Date.now().toString() },
      ]);
    }
    setForm({
      id: "",
      schoolName: "",
      issuedDate: "",
      studentName: "",
      fatherName: "",
      class: "",
      section: "",
      examType: "Final Exam",
    });
  };

  const handleEdit = (id) => {
    const card = admitCards.find((card) => card.id === id);
    setForm(card);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setAdmitCards((prev) => prev.filter((card) => card.id !== id));
  };

  const handleToggleList = () => {
    setIsListVisible((prev) => !prev);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCards(admitCards.map((card) => card.id));
    } else {
      setSelectedCards([]);
    }
  };

  const handleSelect = (id) => {
    setSelectedCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCards = admitCards.filter(
    (card) =>
      card.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.examType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredCards.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredCards.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrint = () => {
    const selected = admitCards.filter((card) =>
      selectedCards.includes(card.id)
    );

    const printContent = selected
      .map(
        (card) => `
        <div style="border: 2px solid black; margin-bottom: 20px; padding: 20px; font-family: Arial, sans-serif; width: 350px; text-align: center;">
          <h3 style="margin-bottom: 10px;">${card.schoolName || "School Name"}</h3>
          <h4 style="margin-bottom: 5px;">Issued Date: ${
            card.issuedDate || "Not Provided"
          }</h4>
          <h4 style="margin-bottom: 20px;">${card.examType}</h4>
          <h2 style="margin-bottom: 20px; background: lightgray; padding: 10px;">ADMIT CARD</h2>
          <p><strong>Name of Student:</strong> ${card.studentName}</p>
          <p><strong>Father's Name:</strong> ${card.fatherName}</p>
          <p><strong>Class:</strong> ${card.class}</p>
          <p><strong>Section:</strong> ${card.section}</p>
          <div style="text-align: left; margin-top: 20px;">
            <h4>Instructions:</h4>
            <ul>
              <li>Don't carry Mobile in Exam Hall</li>
              <li>Don't carry Digital Watch in Exam Hall</li>
            </ul>
          </div>
          <div style="margin-top: 20px; display: flex; justify-content: space-between;">
            <span>Class Teacher</span>
            <span>Principal</span>
          </div>
        </div>
      `
      )
      .join("");

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Admit Cards</title>
        </head>
        <body style="display: flex; flex-wrap: wrap; justify-content: center;">
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
        <h1 className="text-2xl font-bold mb-4">Manage Admit Cards</h1>

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
              <label className="block text-gray-600">School Name</label>
              <input
                type="text"
                name="schoolName"
                value={form.schoolName}
                onChange={handleInputChange}
                className="border w-full px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">Issued Date</label>
              <input
                type="date"
                name="issuedDate"
                value={form.issuedDate}
                onChange={handleInputChange}
                className="border w-full px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
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
              <label className="block text-gray-600">Father's Name</label>
              <input
                type="text"
                name="fatherName"
                value={form.fatherName}
                onChange={handleInputChange}
                className="border w-full px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-600">Class</label>
                <input
                  type="text"
                  name="class"
                  value={form.class}
                  onChange={handleInputChange}
                  className="border w-full px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600">Section</label>
                <input
                  type="text"
                  name="section"
                  value={form.section}
                  onChange={handleInputChange}
                  className="border w-full px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">Type of Examination</label>
              <select
                name="examType"
                value={form.examType}
                onChange={handleInputChange}
                className="border w-full px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="Final Exam">Final Exam</option>
                <option value="Midterm Exam">Midterm Exam</option>
                <option value="Unit Test">Unit Test</option>
              </select>
            </div>
            <button
              type="submit"
              className={`px-4 py-2 rounded ${
                isEditing
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              {isEditing ? "Update Admit Card" : "Create Admit Card"}
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
                        selectedCards.length === admitCards.length &&
                        admitCards.length > 0
                      }
                    />
                  </th>
                  <th className="border border-gray-200 px-4 py-2">School Name</th>
                  <th className="border border-gray-200 px-4 py-2">Issued Date</th>
                  <th className="border border-gray-200 px-4 py-2">Student Name</th>
                  <th className="border border-gray-200 px-4 py-2">Father Name</th>
                  <th className="border border-gray-200 px-4 py-2">Class</th>
                  <th className="border border-gray-200 px-4 py-2">Section</th>
                  <th className="border border-gray-200 px-4 py-2">Exam Type</th>
                  <th className="border border-gray-200 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((card) => (
                  <tr key={card.id}>
                    <td className="border border-gray-200 px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedCards.includes(card.id)}
                        onChange={() => handleSelect(card.id)}
                      />
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {card.schoolName}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {card.issuedDate}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {card.studentName}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {card.fatherName}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {card.class}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {card.section}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {card.examType}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <button
                        onClick={() => handleEdit(card.id)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(card.id)}
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
            {selectedCards.length > 0 && (
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
