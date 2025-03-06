import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSchoolAdmin, deleteSchoolAdmin, fetchSchoolAdmins } from '../../store/authSlice';
import Pagination from './Pagination';

/**
 * SchoolAdminList Component
 * Displays a list of School Admins with options to enable/disable and delete.
 */
const SchoolAdminList = () => {
  const dispatch = useDispatch();
  const {
    schoolAdmins,
    schoolAdminsStatus,
    schoolAdminsError,
    schoolAdminPage,
    schoolAdminPages,
  } = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token);

  const [currentPage, setCurrentPage] = useState(schoolAdminPage || 1);
  const [limit] = useState(10); // Items per page

  useEffect(() => {
    if (token) {
      dispatch(fetchSchoolAdmins({ page: currentPage, limit }));
    }
  }, [dispatch, token, currentPage, limit]);

  /**
   * Handles toggling the active status of a School Admin.
   *
   * @param {string} adminId - ID of the School Admin.
   * @param {boolean} currentStatus - Current active status.
   */
  const handleToggleActive = async (adminId, currentStatus) => {
    if (!adminId) {
      console.error('Admin ID is undefined.');
      return;
    }

    const action = currentStatus ? 'Disable' : 'Enable';
    const confirmAction = confirm(`Are you sure you want to ${action} this School Admin?`);
    if (!confirmAction) return;

    // Optimistically update the UI
    const updatedAdmins = schoolAdmins.map((admin) =>
      admin._id === adminId ? { ...admin, isActive: !currentStatus } : admin
    );
    dispatch({ type: 'auth/setSchoolAdmins', payload: updatedAdmins });

    try {
      // Update the database in the background
      const resultAction = await dispatch(
        updateSchoolAdmin({ adminId, isActive: !currentStatus })
      );

      if (updateSchoolAdmin.fulfilled.match(resultAction)) {
        console.log(`Successfully ${action}d School Admin.`);
      } else {
        throw new Error(resultAction.payload?.message || `Failed to ${action} School Admin.`);
      }
    } catch (err) {
      console.error(`Failed to ${action} School Admin:`, err);
      alert(`Error: ${err.message || `Failed to ${action} School Admin.`}`);
      // Rollback the UI update on error
      dispatch(fetchSchoolAdmins({ page: currentPage, limit }));
    }
  };

  /**
   * Handles deleting a School Admin.
   *
   * @param {string} adminId - ID of the School Admin.
   */
  const handleDelete = async (adminId) => {
    if (!adminId) {
      console.error('Admin ID is undefined.');
      return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this School Admin? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      const resultAction = await dispatch(deleteSchoolAdmin(adminId));

      if (deleteSchoolAdmin.fulfilled.match(resultAction)) {
        console.log('Successfully deleted School Admin.');
      } else {
        console.error('Failed to delete School Admin:', resultAction.payload);
        alert(`Error: ${resultAction.payload?.message || 'Failed to delete School Admin.'}`);
      }
    } catch (err) {
      console.error('Failed to delete School Admin:', err);
      alert(`Error: ${err.message || 'Failed to delete School Admin.'}`);
    }
  };

  console.log(schoolAdmins);

  /**
   * Handles page change from the Pagination component.
   *
   * @param {number} pageNumber - The new page number.
   */
  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Loading and Error States
  if (schoolAdminsStatus === 'loading') {
    return <p>Loading School Admins...</p>;
  }

  if (schoolAdminsStatus === 'failed') {
    return <p className="text-red-600">Error: {schoolAdminsError}</p>;
  }

  if (!Array.isArray(schoolAdmins)) {
    console.error('schoolAdmins is not an array:', schoolAdmins);
    return <p className="text-red-600">Error: Invalid data format.</p>;
  }

  if (schoolAdmins.length === 0) {
    return <p>No School Admins found.</p>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">First Name</th>
              <th className="py-2 px-4 border-b">Last Name</th>
              <th className="py-2 px-4 border-b">Staff Role</th>
              <th className="py-2 px-4 border-b">School ID</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schoolAdmins.map((admin) => {
              if (!admin || !admin._id) {
                console.warn('Encountered undefined admin or missing _id:', admin);
                return null; // Skip rendering this row
              }

              return (
                <tr key={admin._id} className={admin.isActive ? '' : 'bg-gray-100'}>
                  <td className="py-2 px-4 border-b">{admin.email}</td>
                  <td className="py-2 px-4 border-b">{admin.firstName}</td>
                  <td className="py-2 px-4 border-b">{admin.lastName}</td>
                  <td className="py-2 px-4 border-b">{admin.staffRole}</td>
                  <td className="py-2 px-4 border-b">{admin.schoolId}</td>
                  <td className="py-2 px-4 border-b">
                    {admin.isActive ? (
                      <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Disabled</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <button
                      onClick={() => handleToggleActive(admin._id, admin.isActive)}
                      className={`px-3 py-1 rounded ${
                        admin.isActive
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {admin.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleDelete(admin._id)}
                      className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <Pagination page={currentPage} pages={schoolAdminPages} onPageChange={onPageChange} />
    </div>
  );
};

export default SchoolAdminList;
