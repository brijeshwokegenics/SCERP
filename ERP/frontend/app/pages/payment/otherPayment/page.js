'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createPayment,
  fetchPayments,
  deletePayment,
  updatePayment,
} from '../../../../store/otherPaymentSlice';

const OtherPaymentForm = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.otherPayment);

  const [form, setForm] = useState({
    _id: '',
    title: '',
    class: '',
    classSection: '',
    student: '',
    amount: '',
    tax: '',
    status: 'Paid',
    description: '',
  });

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (item) => {
    setForm({ ...item });
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this payment?')) {
      await dispatch(deletePayment(id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form._id) {
        await dispatch(updatePayment({ id: form._id, data: form })).unwrap();
      } else {
        await dispatch(createPayment(form)).unwrap();
      }
      setForm({ _id: '', title: '', class: '', classSection: '', student: '', amount: '', tax: '', status: 'Paid', description: '' });
      dispatch(fetchPayments());
    } catch (err) {
      console.error('Error submitting payment:', err);
    }
  };

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-5xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center">{form._id ? 'Update' : 'Add'} Other Payment</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input className="input" type="text" name="title" placeholder="Title*" value={form.title} onChange={handleFormChange} required />
        <input className="input" type="text" name="class" placeholder="Class*" value={form.class} onChange={handleFormChange} required />
        <input className="input" type="text" name="classSection" placeholder="Class Section" value={form.classSection} onChange={handleFormChange} />
        <input className="input" type="text" name="student" placeholder="Student*" value={form.student} onChange={handleFormChange} required />
        <input className="input" type="number" name="amount" placeholder="Amount (₹)*" value={form.amount} onChange={handleFormChange} required />
        <input className="input" type="text" name="tax" placeholder="Tax" value={form.tax} onChange={handleFormChange} />

        <select name="status" className="input" value={form.status} onChange={handleFormChange}>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
        <textarea className="input md:col-span-2" name="description" placeholder="Description" value={form.description} onChange={handleFormChange} />

        <div className="col-span-2">
          <button type="submit" disabled={loading} className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-3 rounded text-lg font-semibold">
            {loading ? 'Submitting...' : form._id ? 'Update Payment' : 'Create Payment'}
          </button>
          {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
        </div>
      </form>

      <h3 className="text-xl font-bold mb-4">All Other Payments</h3>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Title</th>
              <th className="p-2">Class</th>
              <th className="p-2">Student</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="p-2">{item.title}</td>
                <td className="p-2">{item.class}</td>
                <td className="p-2">{item.student}</td>
                <td className="p-2">₹{item.amount}</td>
                <td className="p-2">{item.status}</td>
                <td className="p-2 space-x-2">
                  <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OtherPaymentForm;