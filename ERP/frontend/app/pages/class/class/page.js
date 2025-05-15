'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addClass,
  getAllClasses,
  updateClass,
  deleteClass,
  getClassById,
  clearCurrentClass,
} from '../../../../store/classSlice';

const ClassPage = () => {
  const dispatch = useDispatch();
  const { classes, loading, error, successMessage, currentClass } = useSelector(
    (state) => state.class
  );

  const [formData, setFormData] = useState({
    className: '',
    classNumericValue: '',
    studentCapacity: '',
    ClassSection: [''],
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(getAllClasses());
  }, [dispatch]);

  useEffect(() => {
    if (currentClass) {
      setFormData({
        className: currentClass.className,
        classNumericValue: currentClass.classNumericValue,
        studentCapacity: currentClass.studentCapacity,
        ClassSection: currentClass.ClassSection || [''],
      });
    }
  }, [currentClass]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSectionChange = (value, index) => {
    const updatedSections = [...formData.ClassSection];
    updatedSections[index] = value;
    setFormData((prev) => ({ ...prev, ClassSection: updatedSections }));
  };

  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      ClassSection: [...prev.ClassSection, ''],
    }));
  };

  const removeSection = (index) => {
    const updatedSections = [...formData.ClassSection];
    updatedSections.splice(index, 1);
    setFormData((prev) => ({ ...prev, ClassSection: updatedSections }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      className: formData.className,
      classNumericValue: Number(formData.classNumericValue),
      studentCapacity: Number(formData.studentCapacity),
      ClassSection: formData.ClassSection,
    };

    if (editId) {
      dispatch(updateClass({ id: editId, classData: data })).then(() => {
        resetForm();
        dispatch(clearCurrentClass());
      });
    } else {
      dispatch(addClass(data)).then(() => resetForm());
    }
  };

  const handleEdit = (id) => {
    dispatch(getClassById(id));
    setEditId(id);
  };

  const handleDelete = (id) => {
    dispatch(deleteClass(id));
  };

  const resetForm = () => {
    setFormData({
      className: '',
      classNumericValue: '',
      studentCapacity: '',
      ClassSection: [''],
    });
    setEditId(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Class Management</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-6 space-y-4">
        <input
          type="text"
          name="className"
          value={formData.className}
          onChange={handleChange}
          placeholder="Class Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="classNumericValue"
          value={formData.classNumericValue}
          onChange={handleChange}
          placeholder="Numeric Value"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="studentCapacity"
          value={formData.studentCapacity}
          onChange={handleChange}
          placeholder="Student Capacity"
          className="w-full p-2 border rounded"
          required
        />

        <div>
          <label className="block font-semibold mb-1">Class Sections</label>
          {formData.ClassSection.map((section, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={section}
                onChange={(e) => handleSectionChange(e.target.value, index)}
                placeholder={`Section ${index + 1}`}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="button"
                onClick={() => removeSection(index)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSection}
            className="mt-1 bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
          >
            Add Section
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {editId ? 'Update Class' : 'Add Class'}
        </button>
      </form>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {successMessage && <p className="text-green-600">{successMessage}</p>}

      <div className="bg-white shadow-md rounded overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Class Name</th>
              <th className="px-4 py-2">Numeric Value</th>
              <th className="px-4 py-2">Student Capacity</th>
              <th className="px-4 py-2">Sections</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls._id} className="text-center border-t">
                <td className="px-4 py-2">{cls.className}</td>
                <td className="px-4 py-2">{cls.classNumericValue}</td>
                <td className="px-4 py-2">{cls.studentCapacity}</td>
                <td className="px-4 py-2">
                  {cls.ClassSection && cls.ClassSection.length > 0
                    ? cls.ClassSection.join(', ')
                    : '—'}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(cls._id)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cls._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassPage;
