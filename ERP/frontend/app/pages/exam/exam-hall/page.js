'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchExamHalls,
  createExamHall,
  deleteExamHall,
  updateExamHall,
} from '@/store/examHallSlice';

const ExamHallPage = () => {
  const dispatch = useDispatch();

  // ✅ FIX: Remove incorrect destructuring
  const examHallState = useSelector((state) => state.examHall || {});
  const { halls = [], loading = false, error = null } = examHallState;

  const [tab, setTab] = useState('add'); // ✅ FIX: Removed TypeScript-specific union type
  const [form, setForm] = useState({
    hallName: '',
    hallNumericValue: '',
    hallCapacity: '',
    description: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    hallName: '',
    hallNumericValue: '',
    hallCapacity: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingId) {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch(
      createExamHall({
        ...form,
        hallNumericValue: Number(form.hallNumericValue),
        hallCapacity: Number(form.hallCapacity),
      })
    );
    setForm({ hallName: '', hallNumericValue: '', hallCapacity: '', description: '' });
    setTab('list');
  };

  const handleEdit = (hall) => {
    setEditingId(hall._id);
    setEditForm(hall);
  };

  const handleUpdate = (id) => {
    dispatch(updateExamHall({ id, data: editForm }));
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this hall?')) {
      dispatch(deleteExamHall(id));
    }
  };

  useEffect(() => {
    if (tab === 'list') {
      dispatch(fetchExamHalls());
    }
  }, [tab, dispatch]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab('add')}
          className={`px-4 py-2 rounded ${tab === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          ADD EXAM HALL
        </button>
        <button
          onClick={() => setTab('list')}
          className={`px-4 py-2 rounded ${tab === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          EXAM HALL LIST
        </button>
      </div>

      {/* Add Form */}
      {tab === 'add' && (
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-sm">Hall Name*</label>
            <input
              name="hallName"
              value={form.hallName}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Hall Numeric Value*</label>
            <input
              type="number"
              name="hallNumericValue"
              value={form.hallNumericValue}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Hall Capacity*</label>
            <input
              type="number"
              name="hallCapacity"
              value={form.hallCapacity}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 bg-gray-100"
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-md font-bold"
            >
              {loading ? 'ADDING...' : 'ADD HALL'}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {tab === 'list' && (
        <div className="space-y-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            halls.map((hall) => (
              <div key={hall._id} className="p-4 bg-gray-50 border rounded-md shadow">
                {editingId === hall._id ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-3">
                      <input
                        name="hallName"
                        value={editForm.hallName}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded-md w-full"
                      />
                      <input
                        name="hallNumericValue"
                        value={editForm.hallNumericValue}
                        onChange={handleChange}
                        type="number"
                        className="border px-2 py-1 rounded-md w-full"
                      />
                      <input
                        name="hallCapacity"
                        value={editForm.hallCapacity}
                        onChange={handleChange}
                        type="number"
                        className="border px-2 py-1 rounded-md w-full"
                      />
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded-md w-full"
                        rows={2}
                      />
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleUpdate(hall._id)}
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>{hall.hallName}</strong> (#{hall.hallNumericValue})
                    </p>
                    <p>Capacity: {hall.hallCapacity}</p>
                    <p className="text-sm text-gray-600">{hall.description}</p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(hall)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(hall._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ExamHallPage;
