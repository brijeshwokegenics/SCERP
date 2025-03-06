"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../../../store/subjectSlice";
import { fetchTeachers } from "../../../store/teacherSlice";

export default function Subjects() {
  const dispatch = useDispatch();
  const {subjects = [] , loading, error } = useSelector((state) => state.subjects);
  const { teachers = [] } = useSelector((state) => state.teachers);

  const classOptions = [
    "Playway", "Nursery", "LKG", "UKG", "1", "2", "3", "4", "5", "6",
    "7", "8", "9", "10", "11", "12"
  ];

  const [subjectData, setSubjectData] = useState({
    name: "",
    code: "",
    teacher: "",
    classes: [], // ✅ Ensure array format
  });

  const [editingId, setEditingId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchTeachers());
  }, [dispatch]);

  const handleChange = (e) => {
    setSubjectData({ ...subjectData, [e.target.name]: e.target.value });
  };

  const handleClassToggle = (selectedClass) => {
    setSubjectData((prev) => ({
      ...prev,
      classes: prev.classes.includes(selectedClass)
        ? prev.classes.filter((cls) => cls !== selectedClass) // Remove if exists
        : [...prev.classes, selectedClass], // Add if not exists
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Check if the subject code already exists (excluding the currently editing subject)
    const isCodeDuplicate = subjects.some(
      (sub) => sub.code === subjectData.code && sub._id !== editingId
    );
  
    if (isCodeDuplicate) {
      alert("Subject code must be unique.");
      return;
    }
  
    if (editingId) {
      dispatch(updateSubject({ id: editingId, subjectData }));
    } else {
      dispatch(createSubject(subjectData));
    }
  
    setSubjectData({ name: "", code: "", teacher: "", classes: [] });
    setEditingId(null);
    setShowDropdown(false);
  };

  const handleEdit = (subject) => {
    setEditingId(subject._id);
    setSubjectData({
      name: subject.name,
      code: subject.code,
      teacher: subject.teacher,
      classes: Array.isArray(subject.classes) ? subject.classes : [], // ✅ Ensure array
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteSubject(id));
  };
console.log(subjects)
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">📚 Subjects Management</h1>

      {/* Form for Adding/Editing Subjects */}
      <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white border rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4">
          {/* Subject Name */}
          <div>
            <label className="block text-gray-700 font-semibold">Subject Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Subject Name"
              value={subjectData.name}
              onChange={handleChange}
              className="border p-2 w-full rounded-lg"
              required
            />
          </div>

          {/* Subject Code */}
          <div>
            <label className="block text-gray-700 font-semibold">Subject Code</label>
            <input
              type="text"
              name="code"
              placeholder="Enter Code"
              value={subjectData.code}
              onChange={handleChange}
              className="border p-2 w-full rounded-lg"
              required
            />
          </div>

          {/* Teacher Dropdown */}
          <div>
            <label className="block text-gray-700 font-semibold">Assigned Teacher</label>
            <select
              name="teacher"
              value={subjectData.teacher}
              onChange={handleChange}
              className="border p-2 w-full rounded-lg"
              required
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.firstName} {teacher.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Class Multi-Select Dropdown */}
          <div className="relative">
            <label className="block text-gray-700 font-semibold">Classes</label>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="border p-2 w-full rounded-lg bg-white cursor-pointer flex justify-between items-center"
            >
              <span>
                {subjectData.classes.length > 0
                  ? subjectData.classes.join(", ")
                  : "Select Classes"}
              </span>
              <span>▼</span>
            </div>

            {showDropdown && (
              <div
                className="absolute w-full border bg-white rounded-lg shadow-md mt-1 max-h-60 overflow-y-auto z-10"
                onClick={(e) => e.stopPropagation()} // Prevent closing on click inside
              >
                {classOptions.map((cls) => (
                  <label key={cls} className="block p-2 hover:bg-gray-100 cursor-pointer flex items-center">
                    <input
                      type="checkbox"
                      checked={subjectData.classes.includes(cls)}
                      onChange={() => handleClassToggle(cls)}
                      className="mr-2"
                    />
                    {cls}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-4 text-center">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">
            {editingId ? "Update" : "Add"} Subject
          </button>
        </div>
      </form>

      {/* Table for Displaying Subjects */}
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Code</th>
                <th className="border p-3 text-left">Teacher</th>
                <th className="border p-3 text-left">Classes</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject._id} className="border hover:bg-gray-50">
                  <td className="border p-3">{subject.name}</td>
                  <td className="border p-3">{subject.code}</td>
                  <td className="border p-3">
                    {teachers.find((t) => t._id === subject.teacher)?.firstName || "Unknown"}
                  </td>
                  <td className="border p-3">{subject.classes?.join(", ")}</td>
                  <td className="border p-3 text-center">
                    <button onClick={() => handleEdit(subject)} className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded mr-2">✏ Edit</button>
                    <button onClick={() => handleDelete(subject._id)} className="bg-red-500 hover:bg-red-600 text-white p-1 rounded">🗑 Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
