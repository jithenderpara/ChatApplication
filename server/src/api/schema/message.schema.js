import mongoose from "mongoose";
const messageInfoSchema = {
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  file: [
    {
      name: {
        type: String,
        required: true,
      },
      path: {
        type: String,
        required: true,
      },
    },
  ],
  createdDate: { type: Date, default: Date.now },
};
const MessageSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  massages: [messageInfoSchema],
  createdDate: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
});
export { MessageSchema };
