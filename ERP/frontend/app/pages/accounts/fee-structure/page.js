"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllFeeStructures,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  getFeeStructureById,
  clearCurrentStructure,
} from '@/store/fee/feeStructureSlice';
import { getAllFeeComponents } from '@/store/fee/feeComponentSlice';
import { getAllCampus } from '@/store/fee/campusSlice';
import { toast } from 'react-toastify';

const FeeStructureManager = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    className: '',
    stream: '',
    academicYear: '',
    feeComponents: [],
    campus: '',
  });

  const { structures: feeStructures, currentStructure, loading, error } = useSelector(state => state.feeStructure);
  const { feeComponents } = useSelector(state => state.feeComponent);
  const { campuses } = useSelector(state => state.campus);

  useEffect(() => {
    dispatch(getAllFeeStructures({ token }));
    dispatch(getAllFeeComponents({ token }));
    dispatch(getAllCampus({ token }));
  }, [dispatch, token]);

  useEffect(() => {
    if (
      editingId &&
      currentStructure &&
      currentStructure._id === editingId
    ) {
      setFormData({
        className: currentStructure.className || '',
        stream: currentStructure.stream || '',
        academicYear: currentStructure.academicYear || '',
        feeComponents: Array.isArray(currentStructure.feeComponents)
          ? currentStructure.feeComponents.map(f => (typeof f === 'object' ? f._id : f))
          : [],
        campus: typeof currentStructure.campus === 'object'
          ? currentStructure.campus._id
          : currentStructure.campus || '',
      });
    }
  }, [editingId, currentStructure]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckboxChange = (id) => {
    setFormData(prev => {
      const exists = prev.feeComponents.includes(id);
      const updated = exists
        ? prev.feeComponents.filter(fid => fid !== id)
        : [...prev.feeComponents, id];
      return { ...prev, feeComponents: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dispatch(updateFeeStructure({ id: editingId, formData, token })).unwrap();
        toast.success('Fee Structure Updated');
      } else {
        await dispatch(createFeeStructure({ formData, token })).unwrap();
        toast.success('Fee Structure Created');
      }

      setFormData({ className: '', stream: '', academicYear: '', feeComponents: [], campus: '' });
      setEditingId(null);
      setShowForm(false);
      dispatch(clearCurrentStructure());
    } catch (err) {
      toast.error(err);
    }
  };

const handleEdit = (id) => {
  console.log('Editing ID:', id); // 👈 Add this
  if (!id) {
    console.error("Invalid ID passed to handleEdit");
    return;
  }
  setEditingId(id);
  setShowForm(true);
  dispatch(getFeeStructureById({ id, token }));
};


  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee structure?')) return;
    try {
      await dispatch(deleteFeeStructure({ id, token })).unwrap();
      toast.success('Fee Structure Deleted');
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {editingId ? 'Edit' : 'Create'} Fee Structure
        </h1>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          onClick={() => {
            setEditingId(null);
            setFormData({ className: '', stream: '', academicYear: '', feeComponents: [], campus: '' });
            dispatch(clearCurrentStructure());
            setShowForm(prev => !prev);
          }}
        >
          {showForm ? 'Close Form' : '+ Create New'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <div>
            <label className="block text-sm font-semibold">Class Name</label>
            <input
              type="text"
              name="className"
              value={formData.className}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Stream (Optional)</label>
            <input
              type="text"
              name="stream"
              value={formData.stream}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Academic Year</label>
            <input
              type="text"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Campus</label>
            <select
              name="campus"
              value={formData.campus}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Campus</option>
              {campuses?.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Fee Components</label>
            <div className="grid grid-cols-2 gap-2">
              {feeComponents?.map(fc => (
                <label key={fc._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.feeComponents.includes(fc._id)}
                    onChange={() => handleCheckboxChange(fc._id)}
                  />
                  <span>{fc.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {editingId ? 'Update' : 'Create'} Fee Structure
          </button>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      )}

      <h2 className="text-xl font-semibold mt-10 mb-4">All Fee Structures</h2>

      <table className="w-full border mt-4 bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Class</th>
            <th className="border p-2">Stream</th>
            <th className="border p-2">Year</th>
            <th className="border p-2">Campus</th>
            <th className="border p-2">Components</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {feeStructures.map(fs => (
            <tr key={fs._id} className={editingId === fs._id ? 'bg-yellow-50' : ''}>
              <td className="border p-2">{fs.className || '_'}</td>
              <td className="border p-2">{fs.stream || '-'}</td>
              <td className="border p-2">{fs.academicYear}</td>
              <td className="border p-2">
                {Array.isArray(fs.campus) && fs.campus.length > 0
                  ? fs.campus
                      .map(c =>
                        typeof c === 'object'
                          ? c.name
                          : campuses.find(camp => camp._id === c)?.name || 'Unknown'
                      )
                      .filter(Boolean)
                      .join(', ')
                  : campuses.find(camp => camp._id === fs.campus)?.name || 'N/A'}
              </td>
              <td className="border p-2">
                {fs.feeComponents
                  ?.map(id => {
                    const comp = feeComponents.find(fc => fc._id === id);
                    return comp ? comp.label : '';
                  })
                  .filter(Boolean)
                  .join(', ')}
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(fs._id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(fs._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeeStructureManager;
