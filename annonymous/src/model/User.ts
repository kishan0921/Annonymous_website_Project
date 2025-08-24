// Mongoose to hume lagega hi , and kyuki hum typeScript me hai,to 2-3 chiz extra
// lagega hi , to document bhi le lete hai mongoose se.
// Schema - taaki har baar mongoose.schema na likhna pade
// Document - type Safety bhi hum introduced kr rahe hai.
import mongoose, { Schema, Document } from "mongoose";

// Ab jab bhi hum typeScript likhte hai , to
// 1st step hota hai , hume data ka type define krna pdta h
// Note: Type define krna ke liye interface, ek famouse datatype use hota h
// mai isse export kr leta hu and normally, interface hi hota and hum interface ka name "Message" de rahe h
// and lastly, ye mongoos ke document me hi banega so , extends Document
export interface Message extends Document {
  // Yaha mai, apne message ki baat kr raha hu, ki mesage jo hoga wo string type me hoga
  // Note: Mongoose ke ander schema, type : content: string; aise hota h,
  // and yaha pe aise type: String,
  content: string;
  // ab message kb create hua ye bhi mujhe chahiye, to usska mai Date type rakh deta hu.
  // Note: Ye jo format h , ye typeScript se mujhe milte h
  createdAt: Date;
}

// Chalo Ab message ka Schema bana lete hai hum.
// Normal : Syntax
// const MessageSchema = new mongoose.Schema ({
// })
// But Hum Uppar custum Schema banaye hai to ussko use krenge.
// and yaha hum MessageSchema ko bolenge, ki ye ek Schema follow krega Schema me kon ?<Message> waala.
// <>- Diamong bracket bolte hai isse.
const MessageSchema: Schema<Message> = new mongoose.Schema({
  // ab mujhe sabse pehle content chahiye
  content: {
    // Note: Mongoose ke ander schema, type : content: string; aise hota h,
    // and yaha pe aise type: String,
    type: String,
    // and required kr dete h true
    required: true,
  },

  // content kab create hua, usske liye createAt bana lete h
  createdAt: {
    // isska type Date
    type: Date,
    required: true,
    // and default bhi de dete hai value.
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
}

// Updated User schema
const UserSchema: Schema<User> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify Code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
