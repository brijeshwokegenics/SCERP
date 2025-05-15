// File: app/dashboard/page.tsx
'use client';

import React from 'react';
import { Card, CardContent } from '../../../components/card';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const TeacherDashboardPage = () => {
  const subjectTasks = [
    { name: 'Mathematics', percent: 80, color: 'bg-orange-400' },
    { name: 'English', percent: 92, color: 'bg-indigo-500' },
    { name: 'Physics', percent: 75, color: 'bg-cyan-400' },
  ];

  const upcomingClasses = [
    { date: 'Apr 24', time: '09:00 AM', subject: 'Mathematics', class: '6A' },
    { date: 'Apr 24', time: '11:00 AM', subject: 'English', class: '6B' },
  ];

  const announcements = [
    'Submit mid-term marks by April 30th.',
    'Attend faculty meeting on Friday at 2 PM.',
  ];

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="col-span-1">
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4">Your Subject Task Completion</h3>
          {subjectTasks.map((task) => (
            <div key={task.name} className="mb-3">
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

      <Card className="col-span-1">
        <CardContent className="p-4 flex flex-col items-center">
          <h3 className="font-semibold text-lg mb-4">Class Performance Score</h3>
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
          <p className="mt-2 text-sm text-gray-600">Average Performance</p>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4">Attendance Overview</h3>
          <div className="text-center mb-2">
            <p className="text-3xl font-bold">0</p>
            <p className="text-gray-500">Attendance Marked</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 inline-block rounded"></span> Present</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 inline-block rounded"></span> Absent</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 inline-block rounded"></span> Late</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-400 inline-block rounded"></span> Half Day</span>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4">Student Feedback Summary</h3>
          <p className="text-sm text-gray-700 mb-2">You have received 12 feedback entries this month.</p>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>8 marked you as Helpful</li>
            <li>3 noted good explanation</li>
            <li>1 requested more examples</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4">Upcoming Classes</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            {upcomingClasses.map((cls, index) => (
              <li key={index} className="flex justify-between">
                <span>{cls.date} {cls.time}</span>
                <span>{cls.subject} - {cls.class}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4">Announcements</h3>
          <ul className="text-sm text-gray-700 list-disc pl-5">
            {announcements.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDashboardPage;
