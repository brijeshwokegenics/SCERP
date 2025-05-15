// File: app/dashboard/page.tsx
'use client';

import React from 'react';
import { Card, CardContent } from '../../../components/card';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
  const subjectTasks = [
    { name: 'Mathematics', percent: 80, color: 'bg-orange-400' },
    { name: 'English', percent: 92, color: 'bg-indigo-500' },
    { name: 'Physics', percent: 75, color: 'bg-cyan-400' },
  ];

  const topStudents = [
    { name: 'Lucas Jones', score: '90%', grade: 'Class 6th' },
    { name: 'Lucas Jones', score: '90%', grade: 'Class 6th' },
  ];

  const genderData = [
    { name: 'Male', value: 60, color: '#FDBA74' },
    { name: 'Female', value: 35, color: '#38BDF8' },
    { name: 'Other', value: 5, color: '#CBD5E1' },
  ];

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-orange-200 text-orange-900">
          <CardContent className="p-4">
            <p className="text-xl font-semibold">1256</p>
            <p>Students</p>
          </CardContent>
        </Card>
        <Card className="bg-indigo-200 text-indigo-900">
          <CardContent className="p-4">
            <p className="text-xl font-semibold">102</p>
            <p>Teachers</p>
          </CardContent>
        </Card>
        <Card className="bg-cyan-200 text-cyan-900">
          <CardContent className="p-4">
            <p className="text-xl font-semibold">102</p>
            <p>Private Teachers</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-2">
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4">Subject Task</h3>
          {subjectTasks.map((task) => (
            <div key={task.name} className="mb-2">
              <div className="flex justify-between mb-1">
                <span>{task.name}</span>
                <span>{task.percent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`${task.color} h-2 rounded-full`} style={{ width: `${task.percent}%` }}></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4">Top Students</h3>
          {topStudents.map((student, i) => (
            <div key={i} className="mb-2 p-2 rounded border">
              <p className="font-semibold">{student.name}</p>
              <p className="text-sm">Allover Score: {student.score}</p>
              <p className="text-xs text-gray-500">{student.grade}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-sm mt-4">
            {genderData.map((g, idx) => (
              <p key={idx} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: g.color }}
                ></span>
                {g.name}: {g.value}%
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Attendance</h3>
            <select className="border rounded px-2 py-1 text-sm">
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">0</p>
            <p className="text-gray-500">Attendance</p>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 inline-block rounded"></span> Present</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 inline-block rounded"></span> Absent</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 inline-block rounded"></span> Late</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-400 inline-block rounded"></span> Half Day</span>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Payment</h3>
            <select className="border rounded px-2 py-1 text-sm">
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">₹0.00</p>
            <p className="text-gray-500">Payment Report</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm mt-4">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-500 inline-block rounded"></span> Paypal</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-500 inline-block rounded"></span> Stripe</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 inline-block rounded"></span> Cash</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-cyan-400 inline-block rounded"></span> Cheque</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 inline-block rounded"></span> Bank Transfer</span>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4 flex justify-between">Fees Payment Details <span className="text-gray-400 cursor-pointer">🔗</span></h3>
          <div className="flex justify-center">
            <img
              src="/no-data.svg"
              alt="No data"
              className="h-32 object-contain"
            />
          </div>
          <div className="mt-4 flex justify-center">
            <button className="bg-blue-600 text-white px-6 py-2 rounded font-medium">FEES PAYMENT</button>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardContent className="p-4 flex flex-col items-center">
          <h3 className="font-semibold text-lg mb-4">Performance Score</h3>
          <div className="w-32 h-32">
            <CircularProgressbar
              value={85}
              text={`85%`}
              styles={buildStyles({
                textSize: '16px',
                textColor: '#1f2937',
                pathColor: '#10b981',
                trailColor: '#d1d5db',
              })}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">Average Class Performance</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;