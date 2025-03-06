import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'  // If using Redux for auth
import { useRouter } from 'next/router'
import axios from 'axios'

// Helper function to get number of days in a given month/year
function getDaysInMonth(month, year) {
  return new Date(year, month, 0).getDate()
}

export default function AttendanceSheet() {
  const router = useRouter()

  // If you have Redux for auth, retrieve the token (and user) here
  const { token, user } = useSelector((state) => state.auth)

  // Local state for filter selections
  const [classId, setClassId] = useState('')
  const [sectionId, setSectionId] = useState('')
  const [month, setMonth] = useState(new Date().getMonth() + 1) // 1-12
  const [year, setYear] = useState(new Date().getFullYear())

  // Attendance sheet data
  const [className, setClassName] = useState('')
  const [sectionName, setSectionName] = useState('')
  const [students, setStudents] = useState([])

  // Messages
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Optionally, protect this page: if not logged in, redirect
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  // Handle the search action
  const handleSearch = async () => {
    if (!classId || !sectionId || !month || !year) {
      setError('Please fill in all filters')
      return
    }
    setError('')
    setLoading(true)

    try {
      // Example: /api/attendanceSheet?classId=...&sectionId=...&month=...&year=...
      const response = await axios.get(
        `http://localhost:5000/api/attendanceSheet?classId=${classId}&sectionId=${sectionId}&month=${month}&year=${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = response.data
      setClassName(data.className)
      setSectionName(data.sectionName)
      setStudents(data.students || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching attendance data')
    } finally {
      setLoading(false)
    }
  }

  const totalDays = getDaysInMonth(month, year)
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout Student Attendance Sheet</h1>

      {/* Filters: Class, Section, Month, Year */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {/* Select Class */}
        <div>
          <label className="block mb-1">Select Class</label>
          <input
            type="text"
            placeholder="e.g. Class 1"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        {/* Select Section */}
        <div>
          <label className="block mb-1">Select Section</label>
          <input
            type="text"
            placeholder="e.g. A"
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        {/* Select Month */}
        <div>
          <label className="block mb-1">Select Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border p-2 w-full"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </select>
        </div>
        {/* Select Year */}
        <div>
          <label className="block mb-1">Select Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border p-2 w-full"
          />
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="bg-orange-500 text-white px-4 py-2 rounded mb-4"
      >
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Attendance Table */}
      {students.length > 0 && !loading && (
        <>
          <h2 className="text-xl font-semibold mb-2">
            Attendance Sheet of {className} / {sectionName}, {month}/{year}
          </h2>
          <div className="overflow-auto">
            <table className="min-w-max bg-white border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">#</th>
                  <th className="border p-2">Student Name</th>
                  {/* Generate a column for each day */}
                  {daysArray.map((day) => (
                    <th key={day} className="border p-2 text-center">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="border p-2 text-center">{idx + 1}</td>
                    <td className="border p-2">{student.name}</td>
                    {/* Render each day's attendance as ✔ or ✘ */}
                    {daysArray.map((day) => {
                      const status = student.attendance?.[day] // "present" or "absent"
                      return (
                        <td key={day} className="border p-2 text-center">
                          {status === 'present' ? (
                            <span className="text-green-600 font-bold">✔</span>
                          ) : status === 'absent' ? (
                            <span className="text-red-600 font-bold">✘</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Example Print/Download button (optional) */}
          <button
            onClick={() => window.print()}
            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
          >
            Print/Download Attendance
          </button>
        </>
      )}
    </div>
  )
}
