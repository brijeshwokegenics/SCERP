// pages/promotions.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdmissions } from '../../../../store/admissionSlice';
import { promoteStudents } from '@/store/promotionSlice';

const classOptions = [
  "nursery",
  "LKG",
  "UKG",
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
];

const PromotionsPage = () => {
  const dispatch = useDispatch();
  const { admissions, loading, error } = useSelector((state) => state.admissions);
  
  // Local state for filtering and selection
  const [filterClass, setFilterClass] = useState('');
  const [targetClass, setTargetClass] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    dispatch(fetchAdmissions());
  }, [dispatch]);

  // Filter admissions based on the selected current class
  const filteredAdmissions = filterClass
    ? admissions.filter(a => a.admissionClass === filterClass)
    : admissions;

  // Toggle selection for a student using their unique _id
  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Select all/deselect all based on the current filtered list
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredAdmissions.map((a) => a._id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  // Bulk update using the promotion action.
  // This dispatches a single action that updates all selected students.
  const handleBulkUpdate = async () => {
    const result = await dispatch(
      promoteStudents({
        studentIds: selectedIds,
        newAdmissionClass: targetClass
      })
    );
    console.log("Bulk update result:", result);
    setSelectedIds([]);
    dispatch(fetchAdmissions());
  };

  // Determine if all visible students are selected
  const allSelected = filteredAdmissions.length > 0 && selectedIds.length === filteredAdmissions.length;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Promotions/Demotions</h1>
      
      <div className="mb-4 flex flex-col md:flex-row items-center gap-4">
        <div>
          <label className="mr-2 font-medium">Filter by Current Class:</label>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Classes</option>
            {classOptions.map((option) => (
              <option key={option} value={option}>
                {option.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-2 font-medium">Select Target Class:</label>
          <select
            value={targetClass}
            onChange={(e) => setTargetClass(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Class</option>
            {classOptions.map((option) => (
              <option key={option} value={option}>
                {option.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 flex gap-4">
        <button
          onClick={handleBulkUpdate}
          disabled={!targetClass || selectedIds.length === 0}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Promote Selected
        </button>
        <button
          onClick={handleBulkUpdate}
          disabled={!targetClass || selectedIds.length === 0}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Demote Selected
        </button>
      </div>

      {loading && <p>Loading admissions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={allSelected}
              />
            </th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Current Class</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdmissions.map((admission) => (
            <tr key={admission._id} className="border-t text-center">
              <td className="py-2 px-4 border">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(admission._id)}
                  onChange={() => handleSelect(admission._id)}
                />
              </td>
              <td className="py-2 px-4 border">
                {`${admission.firstName} ${admission.middleName || ''} ${admission.lastName}`}
              </td>
              <td className="py-2 px-4 border">
                {admission.admissionClass.toUpperCase()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PromotionsPage;
