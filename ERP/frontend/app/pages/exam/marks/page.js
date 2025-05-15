// app/manage-marks/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMarks, createMark, updateMark } from '@/store/markSlice';
import Papa from 'papaparse';
import axios from 'axios';

const ManageMarksPage = () => {
  const dispatch = useDispatch();
  const { marks, loading } = useSelector((state) => state.marks);

  const [filters, setFilters] = useState({
    className: '',
    section: '',
    exam: '',
    subject: ''
  });

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [csvFile, setCsvFile] = useState(null);
  const [studentMarks, setStudentMarks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchMarks());
    fetchDropdownData();
  }, [dispatch]);

  const fetchDropdownData = async () => {
    try {
      const classRes = await axios.get('/api/classes');
      const examRes = await axios.get('/api/exams');
      const subjectRes = await axios.get('/api/subjects');
      setClasses(classRes.data);
      setExams(examRes.data);
      setSubjects(subjectRes.data);
    } catch (error) {
      console.error('Dropdown fetch error:', error);
    }
  };

  const fetchSectionsForClass = async (classId) => {
    try {
      const sectionRes = await axios.get(`/api/classes/${classId}/sections`);
      setSections(sectionRes.data);
    } catch (error) {
      console.error('Section fetch error:', error);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));

    if (name === 'className') {
      await fetchSectionsForClass(value);
    }
  };

  const handleCSVChange = (e) => {
    if (e.target.files) setCsvFile(e.target.files[0]);
  };

  const parseCSV = () => {
    if (!csvFile) return;

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data;
        setStudentMarks(parsedData);
      },
      error: (error) => {
        alert('CSV Parse Error: ' + error.message);
      }
    });
  };

  const handleStudentChange = (index, field, value) => {
    const updated = [...studentMarks];
    updated[index][field] = value;
    setStudentMarks(updated);
  };

  const handleAddMark = (index) => {
    const student = studentMarks[index];
    dispatch(createMark({
      classRef: filters.className,
      section: filters.section,
      examRef: filters.exam,
      subjectRef: filters.subject,
      studentRef: student.rollNo,
      marksObtained: +student.marksObtained,
      comment: student.comment
    }));
  };

  const handleUpdateAll = () => {
    studentMarks.forEach(student => {
      dispatch(updateMark({
        id: student._id || student.id,
        data: {
          marksObtained: +student.marksObtained,
          comment: student.comment
        }
      }));
    });
  };

  const handleManageMarksClick = () => {
    setShowForm(true);

    const filteredStudents = marks.filter(mark =>
      mark.classRef === filters.className &&
      mark.section === filters.section &&
      mark.examRef === filters.exam &&
      mark.subjectRef === filters.subject
    );

    const formatted = filteredStudents.map((mark) => ({
      ...mark,
      rollNo: mark.studentRef.rollNo || mark.studentRef,
      name: mark.studentRef.name || '',
      marksObtained: mark.marksObtained || '',
      comment: mark.comment || ''
    }));

    setStudentMarks(formatted);
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-4 mb-4">
        <select name="className" className="border p-2 rounded w-40" onChange={handleChange}>
          <option value="">Select Class</option>
          {classes.map(cls => (
            <option key={cls._id} value={cls._id}>{cls.className}</option>
          ))}
        </select>
        <select name="section" className="border p-2 rounded w-40" onChange={handleChange}>
          <option value="">Select Section</option>
          {sections.map(sec => (
            <option key={sec} value={sec}>{sec}</option>
          ))}
        </select>
        <select name="exam" className="border p-2 rounded w-40" onChange={handleChange}>
          <option value="">Select Exam</option>
          {exams.map(ex => (
            <option key={ex._id} value={ex._id}>{ex.examName}</option>
          ))}
        </select>
        <select name="subject" className="border p-2 rounded w-40" onChange={handleChange}>
          <option value="">Select Subject</option>
          {subjects.map(sub => (
            <option key={sub._id} value={sub._id}>{sub.subjectName}</option>
          ))}
        </select>
      </div>

      <button onClick={handleManageMarksClick} className="bg-blue-700 text-white px-4 py-2 rounded mb-4">
        MANAGE MARKS
      </button>

      {showForm && (
        <>
          <div className="mb-4">
            <input type="file" onChange={handleCSVChange} className="border p-2" />
          </div>

          <div className="mb-4">
            <button
              className="bg-purple-700 text-white px-4 py-2 rounded mr-2"
              onClick={parseCSV}
            >
              FILL DATA FROM CSV FILE
            </button>
            <span className="text-sm">CSV file must have headers: roll_no, name, marksObtained, comment</span>
          </div>

          <div className="grid grid-cols-5 gap-2 font-semibold border-b pb-2">
            <span>Roll No.</span>
            <span>Name</span>
            <span>Mark Obtained (out of 100)</span>
            <span>Comment</span>
            <span>Action</span>
          </div>

          {studentMarks.map((student, index) => (
            <div key={index} className="grid grid-cols-5 gap-2 items-center py-2 border-b">
              <span>{student.rollNo}</span>
              <span>{student.name}</span>
              <input
                type="number"
                placeholder="Enter mark"
                value={student.marksObtained}
                className="border rounded p-1"
                onChange={(e) => handleStudentChange(index, 'marksObtained', +e.target.value)}
              />
              <input
                type="text"
                placeholder="Add comment"
                value={student.comment || ''}
                className="border rounded p-1"
                onChange={(e) => handleStudentChange(index, 'comment', e.target.value)}
              />
              <button
                onClick={() => handleAddMark(index)}
                className="bg-blue-700 text-white px-2 py-1 rounded text-sm"
              >
                ADD MARK
              </button>
            </div>
          ))}

          {studentMarks.length > 0 && (
            <button
              onClick={handleUpdateAll}
              className="mt-4 bg-blue-700 text-white px-4 py-2 rounded"
            >
              UPDATE ALL MARKS
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ManageMarksPage;
