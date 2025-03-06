// const Attendance = require( "../models/TeacherAttendance.js");
// const Teacher = require("../models/Teacher.js");

// // Fetch attendance records for a specific date
// export const getAttendanceByDate = async (req, res) => {
//   try {
//     const { date } = req.params;
//     const attendanceRecords = await Attendance.find({ date }).populate("teacherId", "name email subject");
//     res.status(200).json({ success: true, attendanceRecords });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error fetching attendance", error });
//   }
// };

// // Fetch attendance records for a specific teacher
// export const getAttendanceByTeacher = async (req, res) => {
//   try {
//     const { teacherId } = req.params;
//     const attendanceRecords = await Attendance.find({ teacherId }).sort({ date: -1 });
//     res.status(200).json({ success: true, attendanceRecords });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error fetching teacher attendance", error });
//   }
// };

// // Mark or update attendance for a teacher on a specific date
// export const markAttendance = async (req, res) => {
//   try {
//     const { teacherId, date, status } = req.body;

//     // Ensure the teacher exists
//     const teacher = await Teacher.findById(teacherId);
//     if (!teacher) {
//       return res.status(404).json({ success: false, message: "Teacher not found" });
//     }

//     let attendance = await Attendance.findOne({ teacherId, date });
//     if (attendance) {
//       attendance.status = status;
//     } else {
//       attendance = new Attendance({ teacherId, date, status });
//     }

//     await attendance.save();
//     res.status(200).json({ success: true, message: "Attendance updated successfully", attendance });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error marking attendance", error });
//   }
// };

// // Delete an attendance record
// export const deleteAttendance = async (req, res) => {
//   try {
//     await Attendance.findByIdAndDelete(req.params.id);
//     res.status(200).json({ success: true, message: "Attendance record deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error deleting attendance", error });
//   }
// };
