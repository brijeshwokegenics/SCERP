'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGrades, createGrade, updateGrade, deleteGrade, clearMessages } from '@/store/gradeSlice';

export default function GradeForm() {
  const dispatch = useDispatch();
  const { grades, loading, error, successMessage } = useSelector((state) => state.grades);

  const [form, setForm] = useState({
    gradeName: '',
    gradePoint: '',
    markFrom: '',
    markUpto: '',
    comment: ''
  });

  const [editId, setEditId] = useState(null);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    dispatch(fetchGrades());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const isFieldInvalid = (field) => touched[field] && !form[field].trim();

  const handleSubmit = (e) => {
    e.preventDefault();

    const allFilled = Object.values(form).every((val) => val.trim() !== '');
    if (!allFilled) {
      setTouched({
        gradeName: true,
        gradePoint: true,
        markFrom: true,
        markUpto: true,
        comment: true
      });
      return;
    }

    if (editId) {
      dispatch(updateGrade({ id: editId, data: form }));
    } else {
      dispatch(createGrade(form));
    }

    setForm({ gradeName: '', gradePoint: '', markFrom: '', markUpto: '', comment: '' });
    setTouched({});
    setEditId(null);
  };

  const handleEdit = (grade) => {
    setForm({
      gradeName: grade.gradeName,
      gradePoint: grade.gradePoint,
      markFrom: grade.markFrom,
      markUpto: grade.markUpto,
      comment: grade.comment
    });
    setEditId(grade._id);
    setTouched({});
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this grade?')) {
      dispatch(deleteGrade(id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow">
        {['gradeName', 'gradePoint', 'markFrom', 'markUpto', 'comment'].map((field, idx) => (
          <div key={idx} className={field === 'comment' ? 'col-span-2' : ''}>
            <label className="block font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}<span className="text-red-500">*</span></label>
            {field === 'comment' ? (
              <textarea
                name={field}
                value={form[field]}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full border rounded p-2"
              ></textarea>
            ) : (
              <input
                type={field === 'gradePoint' || field === 'markFrom' || field === 'markUpto' ? 'number' : 'text'}
                name={field}
                value={form[field]}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full border rounded p-2"
              />
            )}
            {isFieldInvalid(field) && (
              <p className="text-sm text-white bg-red-600 p-1 mt-1 rounded shadow">* This field is required</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="col-span-2 bg-blue-700 text-white py-2 rounded hover:bg-blue-900"
          disabled={loading}
        >
          {editId ? 'UPDATE GRADE' : 'ADD GRADE'}
        </button>

        {(error || successMessage) && (
          <p className={`col-span-2 text-center mt-2 ${error ? 'text-red-600' : 'text-green-600'}`}>
            {error || successMessage}
          </p>
        )}
      </form>

      <div className="mt-8 bg-white shadow p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">Grade List</h2>
        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Grade</th>
              <th className="p-2 border">Point</th>
              <th className="p-2 border">Mark From</th>
              <th className="p-2 border">Mark Upto</th>
              <th className="p-2 border">Comment</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade._id}>
                <td className="p-2 border">{grade.gradeName}</td>
                <td className="p-2 border">{grade.gradePoint}</td>
                <td className="p-2 border">{grade.markFrom}</td>
                <td className="p-2 border">{grade.markUpto}</td>
                <td className="p-2 border">{grade.comment}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => handleEdit(grade)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >Edit</button>
                  <button
                    onClick={() => handleDelete(grade._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
