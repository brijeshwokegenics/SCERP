'use client'

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  createCampus,
  getAllCampus,
  updateCampus,
  deleteCampus
} from '../../../store/fee/campusSlice'

export default function CampusPage() {
  const dispatch = useDispatch()
  const campusState = useSelector((state) => state.campus)
  const campuses = campusState?.campuses || []
  const loading = campusState?.loading || false
  const error = campusState?.error || null
  const token = useSelector((state) => state.auth.token) // adjust based on your auth slice

  const [formData, setFormData] = useState({ name: '', address: '', contactEmail: '', contactPhone: '' })
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (token) {
      dispatch(getAllCampus({ token }))
    }
  }, [dispatch, token])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) return

    if (editId) {
      await dispatch(updateCampus({ id: editId, formData, token }))
    } else {
      await dispatch(createCampus({ formData, token }))
    }

    setFormData({ name: '', address: '', contactEmail: '', contactPhone: '' })
    setEditId(null)
    setShowForm(false)

    dispatch(getAllCampus({ token }))
  }

  const handleDelete = (id) => {
    if (token) {
      dispatch(deleteCampus({ id, token })).then(() => {
        dispatch(getAllCampus({ token }))
      })
    }
  }

  const handleEdit = (campus) => {
    setFormData({
      name: campus.name,
      address: campus.address,
      contactEmail: campus.contactEmail,
      contactPhone: campus.contactPhone,
    })
    setEditId(campus._id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setFormData({ name: '', address: '', contactEmail: '', contactPhone: '' })
    setEditId(null)
    setShowForm(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Campus Management</h1>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create New Campus
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 border p-4 rounded shadow">
          <input
            type="text"
            name="name"
            placeholder="Campus Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="email"
            name="contactEmail"
            placeholder="Contact Email"
            value={formData.contactEmail}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="contactPhone"
            placeholder="Contact Phone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <div className="col-span-full flex space-x-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              {editId ? 'Update Campus' : 'Create Campus'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-blue-500">Loading campuses...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <h2 className="text-2xl font-semibold mb-4">Campus List</h2>
      {campuses.length === 0 ? (
        <p>No campuses found.</p>
      ) : (
        <ul className="space-y-4">
          {campuses.map((campus) => (
            <li key={campus._id} className="p-4 border rounded shadow flex justify-between items-center">
              <div>
                <p className="font-bold">{campus.name}</p>
                <p>{campus.address}</p>
                <p>{campus.contactEmail}</p>
                <p>{campus.contactPhone}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(campus)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(campus._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
