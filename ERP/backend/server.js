// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const admissionRoutes = require('./routes/admissionRoutes');
const schoolsRoutes = require('./routes/schoolRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const subjectRoutes = require( './routes/subjectRoutes'); 
const classRoutineRoutes = require('./routes/classRoutineRoutes');
const transportRoutes = require('./routes/transportRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const holidayRoutes = require('./routes/holidayRoutes');
const hostelRoutes = require('./routes/hostelRoutes');
const roomRoutes = require("./routes/roomRoutes");
const bedRoutes = require("./routes/bedRoutes");
const feePaymentRoutes = require('./routes/feePaymentRoutes');
const expenseRoutes = require('./routes/expenseRoute');
const otherPaymentRoutes = require("./routes/otherPaymentRoutes");
const incomeRoutes = require("./routes/incomeRoutes")
const StudentClassRoutineRoute =  require("./routes/studentClassRoutineRoutes");
const classRoutes = require('./routes/classRoutes')
const examHallRoutes = require('./routes/examHallRoutes')
const examRoutes = require('./routes/examRoutes');
const termCategoryRoutes = require('./routes/termCategoryRoutes');
const markRoutes = require('./routes/markRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const feeComponentRoutes = require('./routes/feeComponentRoutes');
// const feeStructureRoutes = require('./routes/feeStructureRoutes');



const feeStructureRoutes = require('./routes/fee/feeStructureRoutes');
const studentFeeRoutes = require('./routes/fee/studentFeeRoutes');
const paymentRoute = require('./routes/fee/paymentRoutes');
const hostelFeeRoutes = require('./routes/fee/hostelFeeRoutes');
const campusRoutes = require('./routes/fee/campusRoutes');
const auditLogRoutes = require('./routes/fee/auditLogRoutes');
const reportRoutes = require('./routes/fee/reportRoutes');


const path = require('path');
const fs = require('fs');
const StudentClassRoutine = require('./models/StudentClassRoutine');
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('DB Connection Error:', err));

const app = express();

const corsOptions = {
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  }


app.use(cors(corsOptions)); 
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', admissionRoutes);
app.use('/api/schools', schoolsRoutes);
app.use('/api/', teacherRoutes);
app.use('/api/', paymentRoutes)
app.use('/api/library', libraryRoutes);
app.use("/api/subjects", subjectRoutes); 
app.use("/api/class-routines", classRoutineRoutes);
app.use('/api/transports', transportRoutes);
app.use('/api', noticeRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/hostels', hostelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/beds', bedRoutes);
// app.use('/api/fee-payments', feePaymentRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/other-payment', otherPaymentRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/student-class-routine', StudentClassRoutineRoute);
app.use('/api/class', classRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/term-category', termCategoryRoutes);
app.use('/api/exam-halls', examHallRoutes)
app.use('/api/marks', markRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/attendance', attendanceRoutes);
// app.use('/api/feestructures', feeStructureRoutes);
// app.use('/api/feecomponents', feeComponentRoutes);



app.use('/api/fee-structure', feeStructureRoutes);
app.use('/api/student-fee', studentFeeRoutes);
app.use('/api/payment', paymentRoute);
app.use('/api/hostel-fee', hostelFeeRoutes);
app.use('/api/campus', campusRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/audit', auditLogRoutes);









const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
