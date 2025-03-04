import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  _id:string;
  content: string;
  createdAt: Date;
}
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  messages: Message[];
  isVerified: boolean;
  createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
});

const userSchema: Schema<User> = new Schema({
  username: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyCode: { type: String, required: true },
  verifyCodeExpiry: { type: Date, required: true },
  isAcceptingMessage: { type: Boolean, default: true, required: true },
  messages: [messageSchema],
  isVerified: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

export const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);
