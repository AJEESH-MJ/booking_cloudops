import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 255,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    maxlength: 255,
  },
  role: {
    type: String,
    maxlength: 50,
    default: 'user',
  },
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

const User = mongoose.model('User', userSchema);

export default User;
