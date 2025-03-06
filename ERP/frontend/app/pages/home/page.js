import HeaderStats from '../../components/dashboard/HeaderStats';
import EarningsChart from '../../components/dashboard/EarningsChart';
import StudentsPieChart from '../../components/dashboard/StudentsPieChart';

import NoticeBoard from '../../components/dashboard/NoticeBoard';
import FooterStats from '../../components/dashboard/FooterStats';
import CalendarPage from '../../components/dashboard/calendar';


export default function HomePage() {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Header */}
      <HeaderStats />

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EarningsChart />
        <StudentsPieChart />

       <NoticeBoard />
       <CalendarPage />
   
  
  
      </div>
 
      {/* Footer */}
      <FooterStats />
    </div>
  );
}
// src/components/admin/AdminDashboard.js
// "use client"
// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import axios from 'axios';

// const AdminDashboard = () => {
//     const auth = useSelector(state => state.auth);
//     const [data, setData] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const res = await axios.get('/api/schools', {
//                     headers: {
//                         'Authorization': `Bearer ${auth.token}`
//                     }
//                 });
//                 setData(res.data);
//             } catch (err) {
//                 console.error(err);
//             }
//         };
//         fetchData();
//     }, [auth.token]);

//     return (
//         <div>
//             <h1>Admin Dashboard</h1>
//             <ul>
//                 {data.map(school => (
//                     <li key={school._id}>{school.name}</li>
//                 ))}
//             </ul>
//             {/* Add more admin functionalities */}
//         </div>
//     );
// };

// export default AdminDashboard;
