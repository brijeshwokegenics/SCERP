import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchExams,
  createExam,
  updateExam,
  deleteExam,
} from '../../../../store/examSlice';
import {
  fetchTermCategories,
  createTermCategory,
  deleteTermCategory,
} from '../../../../store/termCategorySlice';

export default function ExamManagement() {
  const dispatch = useDispatch();

  const { terms = [], error: termError } = useSelector((state) => state.termCategory || {});
  const { exams = [], error: examError } = useSelector((state) => state.exams || {});

  const [formData, setFormData] = useState({
    examName: '',
    className: '',
    sectionName: '',
    examTerm: '',
    totalMarks: '',
    passingMarks: '',
    examStartDate: '',
    examEndDate: '',
    examComment: '',
    notifyByMail: false,
    notifyBySMSStudents: false,
    notifyBySMSParents: false,
    examSyllabus: null
  });

  const [newTerm, setNewTerm] = useState('');
  const [editingExamId, setEditingExamId] = useState(null);
  const [termAdding, setTermAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('addExam'); // addExam | examList | manageTerms

  useEffect(() => {
    dispatch(fetchTermCategories());
    dispatch(fetchExams());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (editingExamId) {
      dispatch(updateExam({ id: editingExamId, formData: data }));
    } else {
      dispatch(createExam(data));
    }
    resetForm();
  };

  const handleEdit = (exam) => {
    setEditingExamId(exam._id);
    setFormData({
      ...exam,
      notifyByMail: exam.notifyByMail || false,
      notifyBySMSStudents: exam.notifyBySMSStudents || false,
      notifyBySMSParents: exam.notifyBySMSParents || false,
      examSyllabus: null
    });
    setActiveTab('addExam');
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      dispatch(deleteExam(id));
    }
  };

  const handleAddTerm = async () => {
    if (newTerm.trim()) {
      setTermAdding(true);
      try {
        await dispatch(createTermCategory({ name: newTerm })).unwrap();
        await dispatch(fetchTermCategories());
        setNewTerm('');
      } catch (err) {
        alert('Failed to add term: ' + err);
      } finally {
        setTermAdding(false);
      }
    }
  };

  const handleDeleteTerm = (id) => {
    if (confirm('Are you sure you want to delete this term?')) {
      dispatch(deleteTermCategory(id)).then(() => dispatch(fetchTermCategories()));
    }
  };

  const resetForm = () => {
    setFormData({
      examName: '',
      className: '',
      sectionName: '',
      examTerm: '',
      totalMarks: '',
      passingMarks: '',
      examStartDate: '',
      examEndDate: '',
      examComment: '',
      notifyByMail: false,
      notifyBySMSStudents: false,
      notifyBySMSParents: false,
      examSyllabus: null
    });
    setEditingExamId(null);
  };

  return (
    <div className="p-6">
      {/* Tab Buttons */}
      <div className="mb-4 flex gap-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'addExam' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
          onClick={() => setActiveTab('addExam')}
        >
          Add Exam
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'examList' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
          onClick={() => setActiveTab('examList')}
        >
          Exam List
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'manageTerms' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
          onClick={() => setActiveTab('manageTerms')}
        >
          Manage Terms
        </button>
      </div>

      {examError && <p className="text-red-600">{examError}</p>}
      {termError && <p className="text-red-600">{termError}</p>}

      {/* Add Exam Form */}
      {activeTab === 'addExam' && (
        <>
          <h2 className="text-xl font-semibold mb-4">{editingExamId ? 'Update Exam' : 'Add Exam'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <label>
              Exam Name
              <input className="input" name="examName" value={formData.examName} onChange={handleChange} required />
            </label>

            <label>
              Class Name
              <input className="input" name="className" value={formData.className} onChange={handleChange} required />
            </label>

            <label>
              Section Name
              <input className="input" name="sectionName" value={formData.sectionName} onChange={handleChange} required />
            </label>

            <label>
              Exam Term
              <select className="input" name="examTerm" value={formData.examTerm} onChange={handleChange} required>
                <option value="">Select Term</option>
                {terms.map(term => (
                  <option key={term._id} value={term._id}>{term.name}</option>
                ))}
              </select>
            </label>

            <label>
              Passing Marks
              <input className="input" type="number" name="passingMarks" value={formData.passingMarks} onChange={handleChange} required />
            </label>

            <label>
              Total Marks
              <input className="input" type="number" name="totalMarks" value={formData.totalMarks} onChange={handleChange} required />
            </label>

            <label>
              Exam Start Date
              <input className="input" type="date" name="examStartDate" value={formData.examStartDate} onChange={handleChange} required />
            </label>

            <label>
              Exam End Date
              <input className="input" type="date" name="examEndDate" value={formData.examEndDate} onChange={handleChange} required />
            </label>

            <label className="md:col-span-2">
              Exam Comment
              <textarea className="input" name="examComment" value={formData.examComment} onChange={handleChange} required />
            </label>

            <label className="md:col-span-2">
              Upload Exam Syllabus
              <input className="input" type="file" name="examSyllabus" onChange={handleChange} required={!editingExamId} />
            </label>

            <label className="flex items-center">
              <input type="checkbox" name="notifyByMail" checked={formData.notifyByMail} onChange={handleChange} required />
              <span className="ml-2">Notify by Email</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" name="notifyBySMSStudents" checked={formData.notifyBySMSStudents} onChange={handleChange} required />
              <span className="ml-2">Notify Students via SMS</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" name="notifyBySMSParents" checked={formData.notifyBySMSParents} onChange={handleChange} required />
              <span className="ml-2">Notify Parents via SMS</span>
            </label>

            <button type="submit" className="col-span-full bg-blue-600 text-white py-2 rounded-md">
              {editingExamId ? 'Update Exam' : 'Add Exam'}
            </button>
            {editingExamId && (
              <button type="button" onClick={resetForm} className="col-span-full bg-gray-400 text-white py-2 rounded-md">
                Cancel Edit
              </button>
            )}
          </form>
        </>
      )}

      {/* Exam List */}
      {activeTab === 'examList' && (
        <>
          <h3 className="text-lg font-semibold mb-2">All Exams</h3>
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Exam Name</th>
                <th className="p-2">Class</th>
                <th className="p-2">Term</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam._id} className="border-t">
                  <td className="p-2">{exam.examName}</td>
                  <td className="p-2">{exam.className}</td>
                  <td className="p-2">{exam.examTerm?.name || 'N/A'}</td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => handleEdit(exam)} className="text-blue-600">Edit</button>
                    <button onClick={() => handleDelete(exam._id)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Manage Terms */}
      {activeTab === 'manageTerms' && (
        <>
          <h3 className="text-lg font-semibold mb-4">Manage Terms</h3>
          <div className="mb-4 flex items-center gap-2">
            <input className="input" placeholder="New Term Name" value={newTerm} onChange={(e) => setNewTerm(e.target.value)} />
            <button disabled={termAdding} className="bg-green-600 text-white px-4 py-1 rounded" onClick={handleAddTerm}>
              {termAdding ? 'Adding...' : 'Add Term'}
            </button>
          </div>
          <ul className="space-y-2">
            {terms.map(term => (
              <li key={term._id} className="flex justify-between items-center border-b py-1">
                <span>{term.name}</span>
                <button className="text-sm text-red-500" onClick={() => handleDeleteTerm(term._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
