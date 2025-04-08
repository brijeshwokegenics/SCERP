import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMessages,
  createMessage,
  deleteMessage,
  updateMessage,
  fetchMessageById
} from '../../../store/messageSlice';

export default function MessageUI() {
  const dispatch = useDispatch();
  const { items = [], loading = false, error = null } = useSelector((state) => state.messages || {});

  const [activeTab, setActiveTab] = useState('COMPOSE');
  const [formData, setFormData] = useState({
    messageTo: 'Students',
    class: '',
    section: '',
    classSelectionType: 'Single',
    subject: '',
    comment: '',
    attachment: null,
    sendMail: false,
    sendSMS: false
  });

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);
console.log(items);
  useEffect(() => {
    if (activeTab === 'SENT') {
      dispatch(fetchMessages())
        .unwrap()
        .then((data) => {
          console.log('✅ Messages fetched for SENT:', data);
        })
        .catch((err) => {
          console.error('❌ Error fetching messages:', err);
        });
    }
  }, [dispatch, activeTab]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, attachment: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) data.append(key, value);
    });
    dispatch(createMessage(data));
    setFormData({
      messageTo: 'Students',
      class: '',
      section: '',
      classSelectionType: 'Single',
      subject: '',
      comment: '',
      attachment: null,
      sendMail: false,
      sendSMS: false
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      dispatch(deleteMessage(id));
    }
  };

  const handleEdit = async (id) => {
    const message = await dispatch(fetchMessageById(id)).unwrap();
    setFormData({
      ...message,
      class: message.class || '',
      section: message.section || '',
      classSelectionType: message.classSelectionType || 'Single',
      attachment: null
    });
    setActiveTab('COMPOSE');
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {['INBOX', 'SENT', 'VIEW ALL MESSAGE', 'VIEW ALL REPLY MESSAGE', 'COMPOSE'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Compose Tab */}
      {activeTab === 'COMPOSE' && (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Message To*</label>
            <select name="messageTo" value={formData.messageTo} onChange={handleChange} className="border p-2 w-full">
              <option value="Students">Students</option>
              <option value="Teachers">Teachers</option>
              <option value="Parents">Parents</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Class Selection Type</label>
            <select name="classSelectionType" value={formData.classSelectionType} onChange={handleChange} className="border p-2 w-full">
              <option value="Single">Single</option>
              <option value="Multiple">Multiple</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Select Class*</label>
            <input name="class" placeholder="Class" value={formData.class} onChange={handleChange} className="border p-2 w-full" required />
          </div>

          <div>
            <label className="block mb-1">Class Section</label>
            <input name="section" placeholder="Section" value={formData.section} onChange={handleChange} className="border p-2 w-full" />
          </div>

          <div className="col-span-2">
            <label className="block mb-1">Select Users</label>
            <input name="users" placeholder="Select Users" className="border p-2 w-full" disabled />
          </div>

          <div className="col-span-2">
            <label className="block mb-1">Subject*</label>
            <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" className="border p-2 w-full" required />
          </div>

          <div className="col-span-2">
            <label className="block mb-1">Message Comment*</label>
            <textarea name="comment" value={formData.comment} onChange={handleChange} placeholder="Write your message..." className="border p-2 w-full" required />
          </div>

          <div className="col-span-2">
            <label className="block mb-1">Attachment</label>
            <input type="file" name="attachment" onChange={handleChange} className="border p-2 w-full" />
          </div>

          <div className="flex items-center space-x-4 col-span-2">
            <label className="flex items-center">
              <input type="checkbox" name="sendMail" checked={formData.sendMail} onChange={handleChange} className="mr-2" /> Send Mail
            </label>
            <label className="flex items-center">
              <input type="checkbox" name="sendSMS" checked={formData.sendSMS} onChange={handleChange} className="mr-2" /> Send SMS
            </label>
          </div>

          <div className="col-span-2">
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded">SEND MESSAGE</button>
          </div>
        </form>
      )}

      {/* Loading/Error Messages */}
      {loading && <p>Loading messages...</p>}
      {!loading && error && (
        <p className="text-red-500 font-medium">Error: {typeof error === 'string' ? error : JSON.stringify(error)}</p>
      )}

{activeTab === 'SENT' && (
  <div>
    <h2 className="text-xl font-semibold mb-4">Sent Messages</h2>



    {Array.isArray(items) && items.length === 0 ? (
      <p className="text-gray-500 italic">No sent messages found.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Subject</th>
              <th className="px-4 py-2 border">To</th>
              <th className="px-4 py-2 border">Class</th>
              <th className="px-4 py-2 border">Section</th>
              <th className="px-4 py-2 border">Comment</th>
              <th className="px-4 py-2 border">Attachment</th>
              <th className="px-4 py-2 border">Mail</th>
              <th className="px-4 py-2 border">SMS</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((msg, index) => (
              <tr key={msg._id || index} className="border-t">
                <td className="px-4 py-2 border">{msg.subject}</td>
                <td className="px-4 py-2 border">{msg.messageTo}</td>
                <td className="px-4 py-2 border">{msg.class}</td>
                <td className="px-4 py-2 border">{msg.section || '-'}</td>
                <td className="px-4 py-2 border">{msg.comment}</td>
                <td className="px-4 py-2 border">
                  {msg.attachment ? (
                    <a
                      href={`http://localhost:4000/${msg.attachment.replace(/\\\\/g, '/')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  ) : '—'}
                </td>
                <td className="px-4 py-2 border text-center">{msg.sendMail ? '✅' : '❌'}</td>
                <td className="px-4 py-2 border text-center">{msg.sendSMS ? '✅' : '❌'}</td>
                <td className="px-4 py-2 border">{new Date(msg.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button onClick={() => handleEdit(msg._id)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(msg._id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}


      {/* Placeholder for future tabs */}
      {['INBOX', 'VIEW ALL MESSAGE', 'VIEW ALL REPLY MESSAGE'].includes(activeTab) && (
        <div className="text-gray-500 text-sm italic">Feature coming soon for "{activeTab}" tab.</div>
      )}
    </div>
  );
}
