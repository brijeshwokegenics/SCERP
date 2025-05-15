'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getFeeStructureById,
} from '@/store/feeStructureSlice';
import {
  getAllFeeComponents,
  addFeeComponent,
  deleteFeeComponent
} from '@/store/feeComponentSlice';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function FeeStructureDetailPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentStructure, loading: structureLoading } = useSelector((state) => state.feeStructure);
  const { components, loading: componentLoading } = useSelector((state) => state.feeComponent);
  const { token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ name: '', type: '', amount: '', recurrenceType: 'One Time' });

  useEffect(() => {
    if (token && id) {
      dispatch(getFeeStructureById({ id, token }));
      dispatch(getAllFeeComponents({ structureId: id, token }));
    }
  }, [dispatch, token, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.type || !form.amount) return toast.error('Fill all fields');
    try {
      await dispatch(addFeeComponent({ structureId: id, formData: form, token })).unwrap();
      dispatch(getAllFeeComponents({ structureId: id, token }));
      setForm({ name: '', type: '', amount: '', recurrenceType: 'One Time' });
      toast.success('Component Added');
    } catch (error) {
      toast.error(error || 'Failed to add');
    }
  };

  const handleDelete = async (componentId) => {
    if (!confirm('Confirm deletion?')) return;
    try {
      await dispatch(deleteFeeComponent({ structureId: id, componentId, token })).unwrap();
      dispatch(getAllFeeComponents({ structureId: id, token }));
      toast.success('Deleted Successfully');
    } catch (error) {
      toast.error(error || 'Failed to delete');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Components - {currentStructure?.academicYear}</h1>

      {/* Add Fee Component */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <input
          type="text"
          placeholder="Component Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border p-2 w-full rounded"
        >
          <option value="">Select Type</option>
          <option value="class">Class</option>
          <option value="stream">Stream</option>
          <option value="exam">Exam</option>
          <option value="transport">Transport</option>
          <option value="admission">Admission</option>
          <option value="book_copy">Book/Copy</option>
          <option value="hostel">Hostel</option>
          <option value="sports">Sports</option>
          <option value="miscellaneous">Miscellaneous</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <select
          value={form.recurrenceType}
          onChange={(e) => setForm({ ...form, recurrenceType: e.target.value })}
          className="border p-2 w-full rounded"
        >
          <option value="One Time">One Time</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Half-Yearly">Half-Yearly</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Component
        </button>
      </form>

      {/* List Components */}
      <div className="mt-10 space-y-4">
        {componentLoading ? (
          <p>Loading...</p>
        ) : (
          components.map((c) => (
            <div key={c._id} className="bg-gray-100 p-4 rounded shadow flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{c.name}</h3>
                <p>₹{c.amount} ({c.type} - {c.recurrenceType})</p>
              </div>
              <button
                onClick={() => handleDelete(c._id)}
                className="bg-red-600 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
