import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  gender: String,
  username: { type: String, required: false },
  avatar: String,
  createdDate: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});
export {UserSchema};