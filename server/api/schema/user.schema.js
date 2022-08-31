import { Schema } from "mongoose";
const UserSchema = new Schema({
  roles: String,
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
export default UserSchema;

export const UserModel = model<IUserDocument>("user", UserSchema);