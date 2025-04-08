import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createNotification,
  getNotifications,
  updateNotification,
  deleteNotification,
} from '../../../store/notificationSlice';

export default function NotificationPage() {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notifications);

  const [form, setForm] = useState({
    class: 'All',
    section: 'All',
    users: 'All',
    title: '',
    message: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('form');

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateNotification({ id: editingId, data: form }));
    } else {
      dispatch(createNotification(form));
    }
    setForm({ class: 'All', section: 'All', users: 'All', title: '', message: '' });
    setEditingId(null);
    setActiveTab('list');
  };

  const handleEdit = (notification) => {
    setForm(notification);
    setEditingId(notification._id);
    setActiveTab('form');
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      dispatch(deleteNotification(id));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Notifications</h2>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('form')}
          className={`px-4 py-2 rounded ${activeTab === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          {editingId ? 'Edit Notification' : 'Create Notification'}
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 rounded ${activeTab === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Notification List
        </button>
      </div>

      {activeTab === 'form' && (
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block">Select Class</label>
              <select name="class" value={form.class} onChange={handleChange} className="w-full p-2 border rounded">
                <option>All</option>
                <option>Class 1</option>
                <option>Class 2</option>
              </select>
            </div>
            <div>
              <label className="block">Class Section</label>
              <select name="section" value={form.section} onChange={handleChange} className="w-full p-2 border rounded">
                <option>All</option>
                <option>A</option>
                <option>B</option>
              </select>
            </div>
            <div>
              <label className="block">Select Users</label>
              <select name="users" value={form.users} onChange={handleChange} className="w-full p-2 border rounded">
                <option>All</option>
                <option>Teachers</option>
                <option>Students</option>
              </select>
            </div>
            <div>
              <label className="block">Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full p-2 border rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block">Message *</label>
              <textarea name="message" value={form.message} onChange={handleChange} required className="w-full p-2 border rounded"></textarea>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            {editingId ? 'Update Notification' : 'Add Notification'}
          </button>
        </form>
      )}

      {activeTab === 'list' && (
        <>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">Error: {typeof error === 'string' ? error : JSON.stringify(error)}</p>}

          <div className="bg-white shadow rounded">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Class</th>
                  <th className="p-2 border">Section</th>
                  <th className="p-2 border">Users</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notif) => (
                  <tr key={notif._id}>
                    <td className="p-2 border">{notif.title}</td>
                    <td className="p-2 border">{notif.class}</td>
                    <td className="p-2 border">{notif.section}</td>
                    <td className="p-2 border">{notif.users}</td>
                    <td className="p-2 border space-x-2">
                      <button onClick={() => handleEdit(notif)} className="text-blue-500">Edit</button>
                      <button onClick={() => handleDelete(notif._id)} className="text-red-500">Delete</button>
                    </td>
                  </tr>
                ))}
                {notifications.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-500">No notifications found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}