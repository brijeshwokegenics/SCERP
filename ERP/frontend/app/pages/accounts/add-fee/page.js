'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFeeStructures, createFeeStructure, deleteFeeStructure } from '../../../../store/feeStructureSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function FeeStructuresPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { structures, loading } = useSelector((state) => state.feeStructure);
  const { token } = useSelector((state) => state.auth); // assuming auth slice exists

  const [academicYear, setAcademicYear] = useState('');

  useEffect(() => {
    if (token) {
      dispatch(getAllFeeStructures(token));
    }
  }, [dispatch, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!academicYear) return toast.error('Academic Year is required');
    try {
      await dispatch(createFeeStructure({ formData: { academicYear }, token })).unwrap();
      setAcademicYear('');
      toast.success('Fee Structure Created');
    } catch (error) {
      toast.error(error || 'Failed to create');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure to delete?')) return;
    try {
      await dispatch(deleteFeeStructure({ id, token })).unwrap();
      toast.success('Deleted Successfully');
    } catch (error) {
      toast.error(error || 'Failed to delete');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Fee Structures</h1>

      {/* Add Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded space-y-4">
        <input
          type="text"
          className="border p-2 w-full rounded"
          placeholder="Academic Year (e.g., 2024-25)"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Fee Structure
        </button>
      </form>

      {/* Listing */}
      <div className="mt-10 space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          structures.map((structure) => (
            <div key={structure._id} className="bg-gray-100 p-4 rounded shadow flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{structure.academicYear}</h2>
                <p>{structure.components?.length || 0} Components</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/pages/accounts/${structure._id}`)}
                  className="bg-green-600 text-white px-4 py-1 rounded"
                >
                  Manage
                </button>
                <button
                  onClick={() => handleDelete(structure._id)}
                  className="bg-red-600 text-white px-4 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
