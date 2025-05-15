'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createAttendance,
  getAllAttendance,
  updateAttendance,
  deleteAttendance,
  clearCurrentAttendance,
} from '../../../../store/attendanceSlice';
import { getAllClasses } from '../../../../store/classSlice';
import { fetchSubjects } from '../../../../store/subjectSlice';
import { fetchStudentDetails } from '../../../../store/studentsSlice';

export default function AttendancePage() {
  const dispatch = useDispatch();
  const { records, loading, error } = useSelector((state) => state.attendance);
  const { classes = [] } = useSelector((state) => state.class);
  const { subjects = [] } = useSelector((state) => state.subjects);
  const { students = [] } = useSelector((state) => state.students);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    className: '',
    section: '',
    subject: '',
    students: [],
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('attendance');

  useEffect(() => {
    dispatch(getAllClasses());
    dispatch(fetchSubjects());
    dispatch(getAllAttendance());
  }, [dispatch]);

  useEffect(() => {
    if (formData.className && formData.section) {
      dispatch(fetchStudentDetails({
        classId: formData.className,
        section: formData.section,
      }));
    }
  }, [formData.className, formData.section, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentStatusChange = (studentId, status) => {
    const updated = [...formData.students];
    const index = updated.findIndex((s) => s.studentId === studentId);
    if (index > -1) updated[index].status = status;
    else updated.push({ studentId, status });
    setFormData((prev) => ({ ...prev, students: updated }));
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      className: '',
      section: '',
      subject: '',
      students: [],
    });
    setEditingId(null);
    setMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.className || !formData.section || !formData.subject) {
      setMessage('⚠️ Please fill in all required fields.');
      return;
    }

    const action = editingId
      ? updateAttendance({ id: editingId, data: formData })
      : createAttendance({ data: formData });

    dispatch(action)
      .unwrap()
      .then(() => {
        setMessage(editingId ? '✅ Attendance updated.' : '✅ Attendance saved.');
        resetForm();
        dispatch(getAllAttendance());
      })
      .catch(() => {
        setMessage('❌ Operation failed.');
      });
  };

  const handleEdit = (record) => {
    setFormData({
      date: record.date?.split('T')[0],
      className: record.className?._id,
      section: record.section,
      subject: record.subject?._id,
      students: record.students?.map((s) => ({
        studentId: s.studentId._id,
        status: s.status,
      })) || [],
    });
    setEditingId(record._id);
    setMessage('Editing Mode');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      dispatch(deleteAttendance({ id }))
        .unwrap()
        .then(() => {
          setMessage('🗑️ Attendance deleted.');
          dispatch(getAllAttendance());
          resetForm();
        });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex space-x-6 mb-6">
        <button onClick={() => setActiveTab('attendance')} className={`px-4 py-2 rounded ${activeTab === 'attendance' ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}>Attendance</button>
        <button onClick={() => setActiveTab('summary')} className={`px-4 py-2 rounded ${activeTab === 'summary' ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}>Summary</button>
      </div>

      {activeTab === 'attendance' && (
        <>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="border p-2 rounded" />
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
          </form>

          {students.length > 0 && (
            <table className="w-full border mb-6">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Student</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id} className="border-t">
                    <td className="p-2">{student.name}</td>
                    <td className="p-2">
                      <select
                        value={formData.students.find(s => s.studentId === student._id)?.status || ''}
                        onChange={(e) => handleStudentStatusChange(student._id, e.target.value)}
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

          <div className="flex gap-4 mb-8">
            <button type="submit" disabled={loading} className="bg-blue-700 text-white px-6 py-2 rounded">
              {editingId ? 'UPDATE' : 'TAKE ATTENDANCE'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="bg-gray-300 px-6 py-2 rounded">
                Cancel
              </button>
            )}
          </div>

          {message && <p className="text-blue-600 font-semibold mb-4">{message}</p>}
          {error && <p className="text-red-600">Error: {error}</p>}

          <h3 className="text-xl font-bold mb-2">Attendance Records</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm text-gray-600">Filter by Date</label>
              <select className="w-full border p-2 rounded" onChange={(e) => {
                const filter = e.target.value;
                if (filter === 'today') {
                  const today = new Date().toISOString().split('T')[0];
                  setMessage(`📆 Showing records for today: ${today}`);
                } else if (filter === 'this-month') {
                  const month = new Date().toLocaleString('default', { month: 'long' });
                  setMessage(`📆 Showing records for: ${month}`);
                } else {
                  setMessage('Showing all records');
                }
              }}>
                <option value="all">All</option>
                <option value="today">Today</option>
                <option value="this-month">This Month</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Filter by Class</label>
              <select className="w-full border p-2 rounded" onChange={(e) => {
                const selected = classes.find(cls => cls._id === e.target.value);
                setMessage(`🎓 Filtered by Class: ${selected?.className || 'All'}`);
              }}>
                <option value="all">All</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>{cls.className}</option>
                ))}
              </select>
            </div>
          </div>

          <ul className="divide-y">
            {records.map((rec) => (
              <li key={rec._id} className="py-2 flex justify-between items-center">
                <span>📅 {new Date(rec.date).toLocaleDateString()} | {rec.className?.className} | {rec.section}</span>
                <span className="space-x-2">
                  <button onClick={() => handleEdit(rec)} className="bg-yellow-400 px-3 py-1 text-sm rounded">Edit</button>
                  <button onClick={() => handleDelete(rec._id)} className="bg-red-600 text-white px-3 py-1 text-sm rounded">Delete</button>
                </span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => {
              const csvData = [
                ['Date', 'Class', 'Section', 'Subject', 'Student Name', 'Status'],
                ...records.flatMap((rec) =>
                  rec.students.map((s) => [
                    new Date(rec.date).toLocaleDateString(),
                    rec.className?.className,
                    rec.section,
                    rec.subject?.subjectName,
                    s.studentId?.name,
                    s.status,
                  ])
                ),
              ];
              const csvContent = 'data:text/csv;charset=utf-8,' + csvData.map(e => e.join(',')).join('\n');
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', 'attendance_records.csv');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
          >
            📁 Export to CSV
          </button>
        </>
      )}

      {activeTab === 'summary' && (
        <div>
          <h3 className="text-xl font-bold mt-10 mb-2">Attendance Summary</h3>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Student</th>
                <th className="p-2 text-left">Present</th>
                <th className="p-2 text-left">Absent</th>
                <th className="p-2 text-left">Leave</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => {
                let present = 0, absent = 0, leave = 0;
                records.forEach(rec => {
                  rec.students.forEach(s => {
                    if (s.studentId?._id === student._id) {
                      if (s.status === 'Present') present++;
                      if (s.status === 'Absent') absent++;
                      if (s.status === 'Leave') leave++;
                    }
                  });
                });
                return (
                  <tr key={student._id} className="border-t">
                    <td className="p-2">{student.name}</td>
                    <td className="p-2">{present}</td>
                    <td className="p-2">{absent}</td>
                    <td className="p-2">{leave}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
