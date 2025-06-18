'use client'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  createFeeComponent,
  getAllFeeComponents,
  updateFeeComponent,
  deleteFeeComponent,
} from '../../../../store/fee/feeComponentSlice' // Adjust path as needed

const initialForm = {
  name: 'Tuition Fee',
  label: '',
  amount: 0,
  taxable: false,
  gstRate: 0,
}

const feeOptions = [
   'Admission Fee',
      'Tuition Fee',
      'Transport Fee',
      'Activity Fee',
      'Library Fee',
      'Miscellaneous Fee',
      'Exam Fee',
      'Hostel Fee',
      'Sports Fee',
      'Lab Fee',
      'Uniform Fee',
      'other'
]

export default function FeeComponentPage() {
  const dispatch = useDispatch()
  const { feeComponents, loading, error } = useSelector(state => state.feeComponent)
  const token = useSelector(state => state.auth.token)

  const [formData, setFormData] = useState(initialForm)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (token) {
      dispatch(getAllFeeComponents({ token }))
    }
  }, [dispatch, token])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!token) return

    if (editId) {
      dispatch(updateFeeComponent({ id: editId, formData, token }))
    } else {
      dispatch(createFeeComponent({ formData, token }))
    }

    setFormData(initialForm)
    setEditId(null)
    setShowForm(false)
  }

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      label: item.label,
      amount: item.amount,
      taxable: item.taxable,
      gstRate: item.gstRate,
    })
    setEditId(item._id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (token) dispatch(deleteFeeComponent({ id, token }))
  }

  const handleCancel = () => {
    setFormData(initialForm)
    setEditId(null)
    setShowForm(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Fee Components</h1>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
        >
          + Add Fee Component
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 mb-8 rounded shadow bg-white">
  <div>
    <label className="block mb-1 font-semibold">Fee Type</label>
    <select
      name="name"
      value={formData.name}
      onChange={handleChange}
      className="border p-2 rounded w-full"
      required
    >
      {feeOptions.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>

  <div>
    <label className="block mb-1 font-semibold">Display Label</label>
    <input
      type="text"
      name="label"
      value={formData.label}
      onChange={handleChange}
      className="border p-2 rounded w-full"
      placeholder="e.g. Tuition Fee"
      required
    />
  </div>

  <div>
    <label className="block mb-1 font-semibold">Amount (₹)</label>
    <input
      type="number"
      name="amount"
      value={formData.amount}
      onChange={handleChange}
      className="border p-2 rounded w-full"
      placeholder="e.g. 12000"
      required
      min={0}
    />
  </div>

  <div className="flex items-center space-x-2 mt-6">
    <input
      type="checkbox"
      name="taxable"
      checked={formData.taxable}
      onChange={handleChange}
      className="w-4 h-4"
    />
    <label className="font-semibold">GST Applicable?</label>
  </div>

  {formData.taxable && (
    <div>
      <label className="block mb-1 font-semibold">GST Rate (%)</label>
      <input
        type="number"
        name="gstRate"
        value={formData.gstRate}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        placeholder="e.g. 18"
        min={0}
        max={100}
        required
      />
    </div>
  )}

  <div className="col-span-full flex space-x-3 mt-4">
    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
      {editId ? 'Update' : 'Create'}
    </button>
    <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
      Cancel
    </button>
  </div>
</form>

      )}

      {loading && <p className="text-blue-600">Loading...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <ul className="space-y-4">
        {feeComponents.map(item => (
          <li key={item._id} className="p-4 border rounded shadow flex justify-between items-center">
            <div>
              <p className="font-semibold">{item.label}</p>
              <p className="text-sm text-gray-600">Type: {item.name} | ₹{item.amount}</p>
              {item.taxable && (
                <p className="text-sm text-green-600">GST: {item.gstRate}%</p>
              )}
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                Edit
              </button>
              <button onClick={() => handleDelete(item._id)} className="bg-red-600 text-white px-3 py-1 rounded">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
