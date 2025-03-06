// frontend/app/super-admin/manage-school-admins/page.js

'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { fetchSchoolAdmins, logout } from '../../../../store/authSlice';
import SchoolAdminList from '../../../components/SchoolAdminList';

/**
 * ManageSchoolAdminsPage Component
 * Allows SUPER_ADMIN to view and manage School Admins.
 */
export default function ManageSchoolAdminsPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { token, user, schoolAdminsStatus, schoolAdminsError } = useSelector((state) => state.auth);

  // Protect route: only SUPER_ADMIN can access
  useEffect(() => {
    if (!token || !user) {
      router.replace('/'); // Redirect to login if not authenticated
    } else if (user.role !== 'SUPER_ADMIN') {
      router.replace('/'); // Redirect to home if not Super Admin
    }
  }, [token, user, router]);

  // Show a loading state while authenticating
  if (!token || !user) {
    return <p>Redirecting...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage School Admins</h1>

      {/* School Admins List */}
      <SchoolAdminList />

      {/* Optionally, display status or error messages */}
      {schoolAdminsStatus === 'loading' && <p>Loading School Admins...</p>}
      {schoolAdminsStatus === 'failed' && <p className="text-red-600">Error: {schoolAdminsError}</p>}
    </div>
  );
}
