// src/components/AddFeePaymentForm.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createFeePayment,
  clearFeeMessages,
} from '../../../../store/feePaymentSlice';

const recurrenceOptions = [
  'One Time',
  'Weekly',
  'Monthly',
  'Quarterly',
  'Half-Yearly',
];

const AddFeePaymentForm = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.feePayments);

  const [formData, setFormData] = useState({
    recurrenceType: 'One Time',
    class: '',
    classSection: '',
    users: [],
    feesType: '',
    tax: '',
    amount: 0,
    description: '',
    startDate: '',
    endDate: '',
    sendSMSToStudent: false,
    sendSMSToParents: false,
    sendEmailToStudentsAndParents: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createFeePayment(formData));
  };

  useEffect(() => {
    if (success || error) {
      setTimeout(() => dispatch(clearFeeMessages()), 3000);
    }
  }, [success, error, dispatch]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add Fee Payment</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {/* Recurrence Type */}
        <div className="col-span-2">
          <label className="block font-medium mb-2">Recurrence Type</label>
          <div className="flex gap-4">
            {recurrenceOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="recurrenceType"
                  value={opt}
                  checked={formData.recurrenceType === opt}
                  onChange={handleChange}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Class & Section */}
        <div>
          <label className="block">Select Class*</label>
          <input
            type="text"
            name="class"
            value={formData.class}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block">Class Section</label>
          <input
            type="text"
            name="classSection"
            value={formData.classSection}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Users, FeesType, Tax */}
        <input
          type="text"
          name="users"
          placeholder="Select Users (comma-separated IDs)"
          value={formData.users.join(',')}
          onChange={(e) =>
            setFormData({ ...formData, users: e.target.value.split(',') })
          }
          className="col-span-2 border p-2 rounded"
        />
        <input
          type="text"
          name="feesType"
          placeholder="Select Fees Type"
          value={formData.feesType}
          onChange={handleChange}
          className="col-span-1 border p-2 rounded"
        />
        <input
          type="text"
          name="tax"
          placeholder="Select Tax"
          value={formData.tax}
          onChange={handleChange}
          className="col-span-1 border p-2 rounded"
        />

        {/* Amount, Description */}
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          placeholder="Amount"
          className="col-span-1 border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="col-span-1 border p-2 rounded h-[48px] resize-none"
        />

        {/* Dates */}
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* Toggles */}
        <div className="col-span-2 flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="sendSMSToStudent"
              checked={formData.sendSMSToStudent}
              onChange={handleChange}
            />
            SMS to Student
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="sendSMSToParents"
              checked={formData.sendSMSToParents}
              onChange={handleChange}
            />
            SMS to Parents
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="sendEmailToStudentsAndParents"
              checked={formData.sendEmailToStudentsAndParents}
              onChange={handleChange}
            />
            Email to Students & Parents
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Creating...' : 'Create Invoice'}
        </button>
        {success && <p className="text-green-600 col-span-2">{success}</p>}
        {error && <p className="text-red-600 col-span-2">{error}</p>}
      </form>
    </div>
  );
};

export default AddFeePaymentForm;
