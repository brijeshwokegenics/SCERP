// frontend/pages/school-admin/index.js
"use client";
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Dashboard from '../dashboard/page';

export default function SchoolAdminPage() {
  const { token, user } = useSelector((state) => state.auth);
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffRole, setStaffRole] = useState('TEACHER');

  useEffect(() => {
    if (!token || !user || user.role !== 'SCHOOL_ADMIN') {
      router.replace('/');
    }
  }, [token, user, router]);

  const handleCreateStaff = async () => {
    try {
      const res = await axios.post(
        'http://localhost:4000/api/users/staff',
        {
          email: staffEmail,
          password: staffPassword,
          staffRole,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    // <div className="p-4">
    //   <h1 className="text-xl font-bold">School Admin Panel</h1>
    //   <div className="mt-4">
    //     <p>Create a new Staff Account:</p>
    //     <div className="mt-2">
    //       <input
    //         className="border p-2 mr-2"
    //         placeholder="Staff Email"
    //         value={staffEmail}
    //         onChange={(e) => setStaffEmail(e.target.value)}
    //       />
    //       <input
    //         className="border p-2 mr-2"
    //         type="password"
    //         placeholder="Password"
    //         value={staffPassword}
    //         onChange={(e) => setStaffPassword(e.target.value)}
    //       />
    //       <select
    //         className="border p-2 mr-2"
    //         value={staffRole}
    //         onChange={(e) => setStaffRole(e.target.value)}
    //       >
    //         <option value="TEACHER">Teacher</option>
    //         <option value="ACCOUNTANT">Accountant</option>
    //         <option value="PRINCIPAL">Principal</option>
    //         <option value="OTHERS">Others</option>
    //       </select>
    //       <button
    //         className="bg-blue-500 text-white px-4 py-2"
    //         onClick={handleCreateStaff}
    //       >
    //         Create
    //       </button>
    //     </div>
    //     {message && <p className="text-green-600 mt-2">{message}</p>}
    //   </div>
    // </div>


    <main className="bg-amber-600">
    <Dashboard/>
    
        </main>
  );
}
