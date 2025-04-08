'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createIncome,
  fetchIncomes,
  deleteIncome,
  updateIncome,
} from '../../../../store/incomeSlice';

const IncomeForm = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.income);

  const [form, setForm] = useState({
    _id: '',
    class: '',
    classSection: '',
    student: '',
    date: '',
    status: 'Paid',
    entries: [],
  });

  const [entry, setEntry] = useState({ label: '', amount: '' });

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEntryChange = (e) => {
    setEntry({ ...entry, [e.target.name]: e.target.value });
  };

  const addEntry = () => {
    if (entry.label && entry.amount) {
      setForm({ ...form, entries: [...form.entries, entry] });
      setEntry({ label: '', amount: '' });
    }
  };

  const handleEdit = (item) => {
    setForm({ ...item });
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this income?')) {
      await dispatch(deleteIncome(id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form._id) {
        await dispatch(updateIncome({ id: form._id, data: form })).unwrap();
      } else {
        await dispatch(createIncome(form)).unwrap();
      }
      setForm({ _id: '', class: '', classSection: '', student: '', date: '', status: 'Paid', entries: [] });
      dispatch(fetchIncomes());
    } catch (err) {
      console.error('Error submitting income:', err);
    }
  };

  useEffect(() => {
    dispatch(fetchIncomes());
  }, [dispatch]);

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-5xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center">{form._id ? 'Update' : 'Add'} Income</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input className="input" type="text" name="class" placeholder="Class*" value={form.class} onChange={handleFormChange} required />
        <input className="input" type="text" name="classSection" placeholder="Class Section" value={form.classSection} onChange={handleFormChange} />
        <input className="input" type="text" name="student" placeholder="Student*" value={form.student} onChange={handleFormChange} required />
        <input className="input" type="date" name="date" value={form.date} onChange={handleFormChange} required />
        <select name="status" className="input" value={form.status} onChange={handleFormChange}>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>

        <div className="md:col-span-2 border-t pt-4">
          <h3 className="font-semibold mb-2">Income Entries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" type="text" name="label" placeholder="Entry Label*" value={entry.label} onChange={handleEntryChange} />
            <input className="input" type="number" name="amount" placeholder="Amount (₹)*" value={entry.amount} onChange={handleEntryChange} />
          </div>
          <button type="button" onClick={addEntry} className="mt-2 px-4 py-2 bg-gray-800 text-white rounded">
            + Add Entry
          </button>

          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
            {form.entries.map((e, idx) => (
              <li key={idx}>{e.label} - ₹{e.amount}</li>
            ))}
          </ul>
        </div>

        <div className="col-span-2">
          <button type="submit" disabled={loading} className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded text-lg font-semibold">
            {loading ? 'Submitting...' : form._id ? 'Update Income Entry' : 'Create Income Entry'}
          </button>
          {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
        </div>
      </form>

      <h3 className="text-xl font-bold mb-4">All Incomes</h3>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Class</th>
              <th className="p-2">Student</th>
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Total ₹</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="p-2">{item.class}</td>
                <td className="p-2">{item.student}</td>
                <td className="p-2">{new Date(item.date).toLocaleDateString()}</td>
                <td className="p-2">{item.status}</td>
                <td className="p-2">₹{item.entries.reduce((sum, e) => sum + parseFloat(e.amount), 0)}</td>
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

export default IncomeForm;
