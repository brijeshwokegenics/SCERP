'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function EventCalendar() {
  return (
    <div className="bg-white text-gray-600 shadow-md p-4 rounded-md col-span-2">
      <h3 className="text-gray-600 text-lg font-semibold mb-4">Event Calendar</h3>
      <FullCalendar
      className="text-gray-600"
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={[
          { title: 'Parent-Teacher Meeting', date: '2024-11-10' },
          { title: 'Science Fair', date: '2024-11-15' },
          { title: 'School Sports Day', date: '2024-11-20' },
        ]}
        headerToolbar={{
          start: 'prev,next today',
          center: 'title',
          end: 'dayGridMonth',
        }}
        height="400px"
      />
    </div>
  );
}
