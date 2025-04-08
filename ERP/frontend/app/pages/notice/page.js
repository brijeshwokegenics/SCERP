import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  resetNoticeState
} from '../../../store/noticeSlice';

const NoticePage = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, setValue } = useForm();
  const { notices, loading, error, success } = useSelector((state) => state.notices);

  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  useEffect(() => {
    if (editData) {
      setValue('title', editData.title);
      setValue('comment', editData.comment);
      setValue('startDate', editData.startDate?.split('T')[0]);
      setValue('endDate', editData.endDate?.split('T')[0]);
      setValue('noticeFor', editData.noticeFor);
      setValue('sendMail', editData.sendMail);
      setValue('sendSMS', editData.sendSMS);
    } else {
      reset();
    }
  }, [editData, setValue, reset]);

  useEffect(() => {
    if (success) {
      dispatch(resetNoticeState());
      setShowForm(false);
      reset();
      setEditData(null);
    }
  }, [success, dispatch, reset]);

  const onSubmit = (data) => {
    if (editData) {
      dispatch(updateNotice({ id: editData._id, noticeData: data }));
    } else {
      dispatch(createNotice(data));
    }
  };

  const handleEdit = (notice) => {
    setEditData(notice);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      dispatch(deleteNotice(id));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Notices</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditData(null);
            reset();
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {showForm ? 'Close Form' : '+ Create Notice'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded p-4 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Notice Title*</label>
            <input
              {...register('title', { required: true })}
              className="w-full border p-2 rounded"
              placeholder="Notice Title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Notice Comment</label>
            <textarea
              {...register('comment')}
              className="w-full border p-2 rounded"
              placeholder="Notice Comment"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">Start Date*</label>
              <input type="date" {...register('startDate')} className="w-full border p-2 rounded" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">End Date*</label>
              <input type="date" {...register('endDate')} className="w-full border p-2 rounded" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Notice For</label>
            <select {...register('noticeFor')} className="w-full border p-2 rounded">
              <option value="All">All</option>
              <option value="Students">Students</option>
              <option value="Teachers">Teachers</option>
              <option value="Admins">Admins</option>
            </select>
          </div>

          <div className="flex gap-4">
            <label><input type="checkbox" {...register('sendMail')} /> Send Mail</label>
            <label><input type="checkbox" {...register('sendSMS')} /> Send SMS</label>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editData ? 'Update Notice' : 'Create Notice'}
          </button>
        </form>
      )}

      {/* Notices Table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Start</th>
                <th className="p-3">End</th>
                <th className="p-3">For</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => (
                <tr key={notice._id} className="border-t">
                  <td className="p-3">{notice.title}</td>
                  <td className="p-3">{new Date(notice.startDate).toLocaleDateString()}</td>
                  <td className="p-3">{new Date(notice.endDate).toLocaleDateString()}</td>
                  <td className="p-3">{notice.noticeFor}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(notice)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(notice._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {notices.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-gray-500">No notices available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NoticePage;
