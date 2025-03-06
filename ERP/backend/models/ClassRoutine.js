const mongoose = require("mongoose");

const ClassRoutineSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  schedule: [
    {
      day: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        required: true,
      },
      periods: [
        {
          subject: {
            type: String,
            required: true,
          },
          teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
          },
          startTime: {
            type: String, // Example: "09:00 AM"
            required: true,
          },
          endTime: {
            type: String, // Example: "09:45 AM"
            required: true,
          },
          room: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
}, { timestamps: true });

const ClassRoutine = mongoose.model('ClassRoutine', ClassRoutineSchema);
module.exports = ClassRoutine;
