'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createAttendance,
  getAllAttendance,
  updateAttendance,
  deleteAttendance,
} from '@/store/attendanceSlice';
import { getAllClasses } from '@/store/classSlice';
import { fetchSubjects } from '@/store/subjectSlice';
import { fetchStudentDetails } from '@/store/studentsSlice';
import { fetchTeachers } from '@/store/teacherSlice';


export default function CombinedAttendancePage() {
  const dispatch = useDispatch();

  const { records = [] } = useSelector((state) => state.attendance || {});
  const { classes = [] } = useSelector((state) => state.class || {});
  const { subjects = [] } = useSelector((state) => state.subjects || {});
  const { students = [] } = useSelector((state) => state.students || {});
  const { teachers = [] } = useSelector((state) => state.teachers || {});
  const { staff = [] } = useSelector((state) => state.staff || {});

  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    className: '',
    section: '',
    subject: '',
    department: '',
    entries: [],
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(getAllClasses());
    dispatch(fetchSubjects());
    dispatch(fetchTeachers());

    dispatch(getAllAttendance());
  }, [dispatch]);

  useEffect(() => {
    if (role === 'student' && formData.className && formData.section) {
      dispatch(fetchStudentDetails({ classId: formData.className, section: formData.section }));
    }
  }, [formData.className, formData.section, role, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (id, status) => {
    const updated = [...formData.entries];
    const index = updated.findIndex((s) => s.id === id);
    if (index > -1) updated[index].status = status;
    else updated.push({ id, status });
    setFormData((prev) => ({ ...prev, entries: updated }));
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      className: '',
      section: '',
      subject: '',
      department: '',
      entries: [],
    });
    setEditingId(null);
    setMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || formData.entries.length === 0) {
      setMessage('⚠️ Fill all required fields and mark at least one entry.');
      return;
    }

    const action = editingId
      ? updateAttendance({ id: editingId, role, data: formData })
      : createAttendance({ role, data: formData });

    dispatch(action)
      .unwrap()
      .then(() => {
        setMessage(editingId ? '✅ Attendance updated.' : '✅ Attendance saved.');
        resetForm();
        dispatch(getAllAttendance());
      })
      .catch(() => setMessage('❌ Operation failed.'));
  };

  const handleEdit = (record) => {
    setFormData({
      date: record.date?.split('T')[0],
      className: record.className?._id || '',
      section: record.section || '',
      subject: record.subject?._id || '',
      department: record.department || '',
      entries: record.entries.map((e) => ({
        id: e.studentId?._id || e.teacherId?._id || e.staffId?._id,
        status: e.status,
      })),
    });
    setRole(record.role);
    setEditingId(record._id);
    setMessage('✏️ Edit Mode');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      dispatch(deleteAttendance({ id }))
        .unwrap()
        .then(() => {
          setMessage('🗑️ Attendance deleted.');
          dispatch(getAllAttendance());
          resetForm();
        })
        .catch(() => setMessage('❌ Failed to delete record.'));
    }
  };

  const list =
    role === 'student'
      ? students
      : role === 'teacher'
        ? teachers
        : staff;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Attendance Management</h2>

      {/* Role Switch */}
      <div className="flex gap-2 mb-4">
        {['student', 'teacher', 'staff'].map((r) => (
          <button
            key={r}
            className={`px-4 py-2 rounded ${role === r ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setRole(r);
              resetForm();
            }}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input type="date" name="date" value={formData.date} onChange={handleChange} className="border p-2 rounded" />

        {role === 'student' && (
          <>
            <select name="className" value={formData.className} onChange={handleChange} className="border p-2 rounded">
              <option value="">--Select Class--</option>
              {classes.map(cls => <option key={cls._id} value={cls._id}>{cls.className}</option>)}
            </select>
            <select name="section" value={formData.section} onChange={handleChange} className="border p-2 rounded">
              <option value="">--Select Section--</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
            <select name="subject" value={formData.subject} onChange={handleChange} className="border p-2 rounded">
              <option value="">--Select Subject--</option>
              {subjects.map(sub => <option key={sub._id} value={sub._id}>{sub.subjectName}</option>)}
            </select>
          </>
        )}

        {role === 'teacher' && (
          <select name="subject" value={formData.subject} onChange={handleChange} className="border p-2 rounded">
            <option value="">--Select Subject--</option>
            {subjects.map(sub => <option key={sub._id} value={sub._id}>{sub.subjectName}</option>)}
          </select>
        )}

        {role === 'staff' && (
          <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Department" className="border p-2 rounded" />
        )}
      </form>

      {list.length > 0 && (
        <table className="w-full border mb-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">{role.charAt(0).toUpperCase() + role.slice(1)} Name</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map(person => (
              <tr key={person._id} className="border-t">
                <td className="p-2">{person.name}</td>
                <td className="p-2">
                  <select
                    value={formData.entries.find(e => e.id === person._id)?.status || ''}
                    onChange={(e) => handleStatusChange(person._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="">--Select--</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Leave">Leave</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex gap-4 mb-6">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
          {editingId ? 'Update Attendance' : 'Save Attendance'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} className="bg-gray-400 px-6 py-2 rounded">
            Cancel Edit
          </button>
        )}
      </div>

      {message && <p className="text-blue-700 font-semibold mb-6">{message}</p>}

      <h3 className="text-lg font-bold mb-2">Attendance Records</h3>
      <ul className="divide-y">
        {records
          .filter((r) => r.role === role)
          .map((rec) => (
            <li key={rec._id} className="py-2 flex justify-between items-center">
              <span>
                📅 {new Date(rec.date).toLocaleDateString()} | {rec?.className?.className || rec.department || ''} | {rec.section || ''}
              </span>
              <span className="space-x-2">
                <button onClick={() => handleEdit(rec)} className="bg-yellow-400 px-3 py-1 rounded text-sm">Edit</button>
                <button onClick={() => handleDelete(rec._id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}
