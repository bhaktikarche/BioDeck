import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: String,
  website: String,
  bio: String
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['founder','investor'], required: true },
  company: { type: companySchema, default: {} },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
