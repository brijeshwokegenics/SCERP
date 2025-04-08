import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchHolidays,
  addHoliday,
  deleteHoliday,
} from '../../../store/holidaySlice';

const HolidayPage = () => {
  const [activeTab, setActiveTab] = useState('add');
  const dispatch = useDispatch();
  const { holidays, loading, error } = useSelector((state) => state.holiday);

  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    sendMail: false,
    sendSMS: false,
  });

  useEffect(() => {
    if (activeTab === 'list') {
      dispatch(fetchHolidays());
    }
  }, [dispatch, activeTab]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addHoliday(form));
    setForm({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      sendMail: false,
      sendSMS: false,
    });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this holiday?')) {
      dispatch(deleteHoliday(id));
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: 'auto', padding: '2rem', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', marginBottom: '30px' }}>
        {['add', 'list'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: activeTab === tab ? '#005eff' : '#f1f1f1',
              color: activeTab === tab ? '#fff' : '#333',
              fontWeight: 'bold',
              border: '1px solid #ccc',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {tab === 'add' ? '➕ Add Holiday' : '📅 Holiday List'}
          </button>
        ))}
      </div>

      {/* Add Holiday Form */}
      {activeTab === 'add' && (
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '6px' }}>
          <h2 style={{ marginBottom: '20px', color: '#2a2a2a' }}>➕ Add New Holiday</h2>

          <div style={{ marginBottom: '15px' }}>
            <label>Holiday Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g., Diwali"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>End Date *</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>
              <input type="checkbox" name="sendMail" checked={form.sendMail} onChange={handleChange} />
              {' '}Send Mail
            </label>{' '}
            <label style={{ marginLeft: '20px' }}>
              <input type="checkbox" name="sendSMS" checked={form.sendSMS} onChange={handleChange} />
              {' '}Send SMS
            </label>
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#005eff',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            ✅ Add Holiday
          </button>
        </form>
      )}

      {/* Holiday List View */}
      {activeTab === 'list' && (
        <div>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>📅 Holidays</h2>

          {loading && <p>Loading holidays...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && holidays.length === 0 && <p>No holidays found.</p>}

          <div
            style={{
              display: 'grid',
              gap: '20px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            }}
          >
            {holidays.map((holiday) => (
              <div
                key={holiday._id}
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid #eee',
                  borderRadius: '10px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s',
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#2a2a2a' }}>
                  {holiday.title} 🗓️
                </div>

                <div style={{ color: '#555', marginBottom: '8px' }}>
                  <strong>From:</strong> {holiday.startDate?.slice(0, 10)} <br />
                  <strong>To:</strong> {holiday.endDate?.slice(0, 10)}
                </div>

                {holiday.description && (
                  <div style={{ fontStyle: 'italic', color: '#777', marginBottom: '12px' }}>
                    {holiday.description}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {holiday.sendMail && (
                    <span style={{ fontSize: '12px', backgroundColor: '#e8f0fe', padding: '4px 8px', borderRadius: '6px', color: '#1967d2' }}>
                      📧 Mail Enabled
                    </span>
                  )}
                  {holiday.sendSMS && (
                    <span style={{ fontSize: '12px', backgroundColor: '#e0f7fa', padding: '4px 8px', borderRadius: '6px', color: '#00796b' }}>
                      📱 SMS Enabled
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(holiday._id)}
                  style={{
                    marginTop: '15px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  🗑 Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayPage;
