import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClassRoutines,
  createClassRoutine,
  updateClassRoutine,
  deleteClassRoutine,
} from "../../../store/classRoutineSlice";
import { fetchTeachers } from "../../../store/teacherSlice";

const ClassRoutineForm = () => {
  const dispatch = useDispatch();
  const { routines, loading, error } = useSelector((state) => state.classRoutine);
  const { teachers = [] } = useSelector((state) => state.teachers);
  
  const [formData, setFormData] = useState({
    class: "",
    section: "",
    schedule: [],
  });

  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchClassRoutines());
    dispatch(fetchTeachers()); // Fetching teachers
  }, [dispatch]);

  const handleOpen = (routine = null) => {
    if (routine) {
      setFormData(routine);
      setEditId(routine._id);
    } else {
      setFormData({ class: "", section: "", schedule: [] });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handlePeriodChange  = (dayIndex, field, value) => {
  //   const updatedSchedule = formData.schedule.map((day, i) => 
  //     i === dayIndex ? { ...day, [field]: value } : day
  //   );
  
  //   setFormData({ ...formData, schedule: updatedSchedule });
  // };

  const handleScheduleChange = (dayIndex, periodIndex, field, value) => {
    setFormData((prevFormData) => {
      const updatedSchedule = prevFormData.schedule.map((day, i) => {
        if (i === dayIndex) {
          const updatedPeriods = day.periods.map((p, j) =>
            j === periodIndex ? { ...p, [field]: value } : p
          );
          return { ...day, periods: updatedPeriods };
        }
        return day;
      });
  
      return { ...prevFormData, schedule: updatedSchedule };
    });
  };
  


  const addSchedule = () => {
    setFormData({
      ...formData,
      schedule: [...formData.schedule, { day: "Monday", periods: [] }],
    });
  };

  const addPeriod = (dayIndex) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].periods.push({
      subject: "",
      teacher: "",
      startTime: "",
      endTime: "",
      room: "",
    });
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const handleSubmit = async () => {
    if (editId) {
      await dispatch(updateClassRoutine({ id: editId, routineData: formData }));
    } else {
      await dispatch(createClassRoutine(formData));
    }
    handleClose();
  };

  const handleEdit = (routine) => {
    handleOpen(routine);
  };
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };
  
  const handleDelete = async (id) => {
    await dispatch(deleteClassRoutine(id));
  };
console.log(formData);
  return (
    <div className="p-6">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => handleOpen()}
      >
        Add Routine
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{typeof error === "string" ? error : JSON.stringify(error)}</p>}


      {open && (
        <div className="bg-white p-6 shadow-lg rounded-lg mt-4">
          <h2 className="text-lg font-bold mb-4">{editId ? "Edit Routine" : "Add Routine"}</h2>
          <input
            className="w-full border p-2 rounded mb-2"
            type="text"
            name="class"
            placeholder="Class"
            required
            value={formData.class}
            onChange={handleChange}
          />
          <input
            className="w-full border p-2 rounded mb-2"
            type="text"
            name="section"
            required
            placeholder="Section"
            value={formData.section}
            onChange={handleChange}
          />

          <h3 className="font-semibold mt-4">Schedule</h3>
          {formData.schedule.map((day, dayIndex) => (
            <div key={dayIndex} className="border p-3 my-2 rounded bg-gray-100">
              <select
                className="w-full border p-2 rounded mb-2"
                value={day.day}
                onChange={(e) => handleScheduleChange(dayIndex, "day", e.target.value)}
              >
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {day.periods.map((period, periodIndex) => (
                <div key={periodIndex} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="border p-2 rounded w-1/5"
                    placeholder="Subject"
                    value={period.subject}
                    onChange={(e) => {
                      const updatedPeriods = [...day.periods];
                      updatedPeriods[periodIndex].subject = e.target.value;
                      handleScheduleChange(dayIndex, "periods", updatedPeriods);
                    }}
                  />
<select
  className="border p-2 rounded w-1/5"
  value={period.teacher}
  onChange={(e) => handleScheduleChange(dayIndex, periodIndex, "teacher", e.target.value)}
>
  <option value="">Select Teacher</option>
  {teachers.map((teacher) => (
    <option key={teacher._id} value={teacher._id}>
      {`${teacher.firstName} ${teacher.lastName}`}
    </option>
  ))}
</select>

                  <input
      type="text"
      className="border p-2 rounded w-1/6"
      placeholder="Room"
      value={period.room}
      onChange={(e) => {
        const updatedPeriods = [...day.periods];
        updatedPeriods[periodIndex].room = e.target.value;
        handleScheduleChange(dayIndex, "periods", updatedPeriods);
      }}
    />
            <input
  type="time"
  className="border p-2 rounded w-1/5"
  value={period.startTime}
  onChange={(e) => handleScheduleChange(dayIndex, periodIndex, "startTime", e.target.value)}
/>
<input
  type="time"
  className="border p-2 rounded w-1/5"
  value={period.endTime}
  onChange={(e) => handleScheduleChange(dayIndex, periodIndex, "endTime", e.target.value)}
/>



                </div>
              ))}
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => addPeriod(dayIndex)}
              >
                + Add Period
              </button>
            </div>
          ))}
          <button className="bg-gray-500 text-white px-4 py-2 rounded mt-2" onClick={addSchedule}>
            + Add Day
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2" onClick={handleSubmit}>
            {editId ? "Update" : "Save"}
          </button>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Class Routines</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Class</th>
              <th className="border p-2">Section</th>
              <th className="border p-2">Schedule</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routines.map((routine) => (
              <tr key={routine._id} className="text-center border">
                <td className="border p-2">{routine.class}</td>
                <td className="border p-2">{routine.section}</td>
                <td className="border p-2">
        
     

       
                <table className="min-w-full bg-white border border-gray-200 mt-2">
  <thead>
    <tr className="bg-gray-100">
      <th className="border p-2">Day</th>
      <th className="border p-2">Subject</th>
      <th className="border p-2">Teacher</th>
      <th className="border p-2">Room</th>
      <th className="border p-2">Start Time</th>
      <th className="border p-2">End Time</th>
    </tr>
  </thead>
  <tbody>
    {routine.schedule?.length > 0 ? (
      routine.schedule.map((day) =>
        day.periods?.length > 0 ? (
          day.periods.map((p, index) => {
            const teacher = teachers.find((t) => t._id === p.teacher);
            return (
              <tr key={index} className="text-center border">
                <td className="border p-2"><strong>{day.day}</strong></td>
                <td className="border p-2">{p.subject}</td>
                <td className="border p-2">{teacher ? `${teacher.firstName} ${teacher.lastName}` : "N/A"}</td>
                <td className="border p-2">{p.room}</td>
                <td className="border p-2">{formatTime(p.startTime)}</td>
                <td className="border p-2">{formatTime(p.endTime)}</td>
              </tr>
            );
          })
        ) : (
          <tr key={day.day}>
            <td className="border p-2"><strong>{day.day}</strong></td>
            <td colSpan="5" className="text-center p-2">No periods added</td>
          </tr>
        )
      )
    ) : (
      <tr>
        <td colSpan="6" className="text-center p-2">No schedule available</td>
      </tr>
    )}
  </tbody>
</table>


                </td>
                <td className="border p-2">
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onClick={() => handleEdit(routine)}>
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(routine._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassRoutineForm;
