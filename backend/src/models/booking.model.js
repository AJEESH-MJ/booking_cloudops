import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(), // generate string id
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // the user who made the booking
  },
  net: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Net',
    required: true, // the net being booked
  },
  date: {
    type: String,
    required: true,
    match: /^\d{2}-\d{2}-\d{4}$/, // ensures format DD-MM-YYYY
    trim: true,
  },
  startAt: {
    type: Date,
    required: true, // start time of the booking
  },
  endAt: {
    type: Date,
    required: true, // end time of the booking
  },
  durationMinutes: {
    type: Number,
    required: true, // total duration of the booking in minutes
    min: 1,
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // who created this booking (could be admin)
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Automatically update `updated_at` before saving
bookingSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

// Prevent overlapping bookings for the same net and time range
bookingSchema.index({ net: 1, startAt: 1, endAt: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
