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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
