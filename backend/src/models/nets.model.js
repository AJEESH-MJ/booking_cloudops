import mongoose from 'mongoose';

const netSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(), // generate string id
  },
  name: {
    type: String,
    required: true,
    maxlength: 255,
    trim: true,
  },
  capacity: {
    type: Number,
    default: 1,
    min: 1,
  },
  active: {
    type: Boolean,
    default: true,
  },
  meta: {
    type: mongoose.Schema.Types.Mixed, // for any custom additional data
    default: {},
  },
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true, // cannot be changed once set
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Update the updated_at timestamp before each save
netSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const Net = mongoose.model('Net', netSchema);

export default Net;
