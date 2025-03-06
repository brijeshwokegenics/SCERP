// pages/calendar.tsx

"use client";
import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, {
  DateClickArg,
  EventClickArg,
} from '@fullcalendar/interaction'

export default function CalendarPage() {
  // Handle date selections (e.g. click-and-drag on the calendar)
  const handleDateSelect = (selectInfo: any) => {
    alert(`You selected from ${selectInfo.startStr} to ${selectInfo.endStr}`)
  }

  // Handle single date clicks (if you only want to handle a single-day click)
  const handleDateClick = (dateClickInfo: DateClickArg) => {
    alert(`Clicked date: ${dateClickInfo.dateStr}`)
  }

  // Handle event clicks
  const handleEventClick = (clickInfo: EventClickArg) => {
    alert(`Event clicked: ${clickInfo.event.title}`)
  }

  return (
  <div className="bg-white shadow-md p-4 rounded-md col-span-2">

        <FullCalendar
          
           // Plugins
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}

          // Initial view
          initialView="dayGridMonth"

          // Toolbar (header) settings
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}

          // Allow user to select date ranges
          selectable={true}
          selectMirror={true}
          select={handleDateSelect}

          // Date click
          dateClick={handleDateClick}

          // Event click
          eventClick={handleEventClick}

          // Example events
          events={[
            {
              title: 'Parent-Teacher Meeting',
              start: '2025-01-10T10:00:00',
              end: '2025-01-10T11:00:00',
            },
            {
              title: 'Sports Day',
              start: '2025-01-15T08:00:00',
              end: '2025-01-15T14:00:00',
            },
            {
              title: 'Exam Week',
              start: '2025-01-20',
              end: '2025-01-24',
            },
          ]}
          
          // Tailwind might override some of FullCalendar's default spacing,
          // so adjust as needed
         contentHeight="auto"
        />
        </div>

  )
}
