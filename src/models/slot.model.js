import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      default: () => new mongoose.Types.ObjectId().toString(), // string ID
    },
    net: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Net",
      required: true, // reference to the Net this slot belongs to
    },
    date: {
      type: String,
      required: true,
      match: /^\d{2}-\d{2}-\d{4}$/, // ensures format DD-MM-YYYY
      trim: true,
    },
    startAt: {
      type: Date,
      required: true, // exact start time of the slot
    },
    endAt: {
      type: Date,
      required: true, // exact end time of the slot
    },
    booked: {
      type: Boolean,
      default: false, // whether this slot is currently booked
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking", // reference to the Booking if slot is booked
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
  }
);

// Automatically update the `updated_at` timestamp on save
slotSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

// Prevent duplicate slots for the same net, date, and time
slotSchema.index({ net: 1, date: 1, startAt: 1 }, { unique: true });

const Slot = mongoose.model("Slot", slotSchema);

export default Slot;
