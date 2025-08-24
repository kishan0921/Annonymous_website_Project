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


// Overall step in typescript 
// step 1: define interface for our schema
// step 2: define our schema
// step 3: export our schema


// Ab mujhe User ka Schema define krna hai, jo ki same uppar MessageSchema krega.
// Same Exact ussi tarike se banega.

// Ab jab bhi hum typeScript likhte hai , to
// 1st step hota hai , hume data ka type define krna pdta h
// Note: Type define krna ke liye interface, ek famouse datatype use hota h
// mai isse export kr leta hu and normally, interface hi use hota and hum interface ka name "User" de rahe h
// and lastly, ye mongoos ke document me hi banega so , extends Document
// step 1: define interface for our schema
export interface User extends Document {
  // Ab hum ye sab User ke ander fields bana rahe hai.

  // 1st field - username - isska type hum string rakh rahe h
  username: string;
  // 2nd field - email - isska type hum string rakh rahe h
  email: string;
  // 3rd field - password - isska type hum string rakh rahe h
  password: string;
  // 4th field - verifyCode - isska type hum string rakh rahe h
  // User ko verify bhi to kroge, to usske liye code
  verifyCode: string;
  // 5th field - verifyCodeExpiry - isska type hum Date rakh rahe h
  // Verfiy code ki Expiry bhi rakhni padegi, taaki hume pta chalega kb expire ho raha h
  verifyCodeExpiry: Date;
  // 6th field - isVerified - isska type hum boolean rakh rahe h
  
  isVerified: boolean;
  // 7th field - isAcceptingMessages - isska type hum boolean rakh rahe h
  // Isse hume pta chalge, user accept kr raha hai, message ya nahi.
  isAcceptingMessages: boolean;
  // 8th field - messages - isska type hum Message[] rakh rahe h
  //Ab interesting part hai, hume pta chalega ki user kya messages send kr raha hai
  // and har message ka apna document banega, uss message waale docuemnt ko hum User ke ander bhi rakhna chahte hai to
  // jo message hoga user ka, wo array hoga. []
  // but normal array nahi , special array Message type ka like - Message[]
  messages: Message[];
}


// step 2: define our schema
// Yaha hum UserSchema bana rahe hai and , hum yaha pe User ka Schema follow kr rahe hai.
const UserSchema: Schema<User> = new mongoose.Schema({
  // Ab niche jo bhi h, wo sab UserSchema ka fields hai.
  // username ek field hai and isska type hum string rakh rahe h
  username: {
    // yaha pe username ka type string hota h
    type: String,
    // yaha pe required true hota h, and message bhi pass kr rahe hai.
    required: [true, "Username is required"],
    // and yaha pe trim hota h, taaki space nahi honge
    trim: true,
    // and yaha pe unique hota h, taaki same username nahi honge
    unique: true,
  },

  // email ek field hai and isska type hum string rakh rahe h
  email: {
    type: String,
    // yaha pe required true hota h, and message bhi pass kr rahe hai.
    required: [true, "Email is required"],
    unique: true,
    // and yaha pe match hota h, taaki valid email honge
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },

  // password ek field hai and isska type hum string rakh rahe h
  password: {
    type: String,
    // yaha pe required true hota h, and message bhi pass kr rahe hai.
    required: [true, "Password is required"],
  },

  // verifyCode ek field hai and isska type hum string rakh rahe h
  verifyCode: {
    type: String,
    // yaha pe required true hota h, and message bhi pass kr rahe hai.
    required: [true, "Verify Code is required"],
  },

  // verifyCodeExpiry ek field hai and isska type hum Date rakh rahe h
  verifyCodeExpiry: {
    type: Date,
    // yaha pe required true hota h, and message bhi pass kr rahe hai.
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

  // messages ek field hai and isska type hum Message[] rakh rahe h
  // and yaha pe MessageSchema use kr rahe hai
  messages: [MessageSchema],
});



// step 3: export our model
// nEXT JS MAI , aisa hota hai ki isse pta nahi hota hai , ki meri application first time 
// run ho rahi h ya next time run ho rahi hai.. 

// to, issliye nextjs me hum jab model ke data ko export krte hai to Syntax thoda different hota h
// 2 Tarike se export krte hai
// 1st - ho skta hai UserModel pehle se bana ho 
// 2nd - or agar nahi bana hai , to bana lenge  and then return kr denge.

const UserModel =
// 1st case - hum suppose kr raha database me model create hai , hum bs check kr rahe h and return kr rahe h
// mongoose ko bolenge, mujhe models ke ander User chahiye  and issko as mongoose.model<User> schema 
  (mongoose.models.User as mongoose.Model<User>) || 

// 2nd case - Agar 1st time ye schema bana raha h, to 
// Simple - mongoose ko bolenge, mujhe models ke ander model type <User> de do. 
// and normal  as "User" chahiye hume, and scehma kon sa use krna h ? - UserSchema
// Type Script me injection aata hai, ki "mongoose.model" bhi hum Schema type  batate hai like here - <User> waala schema use kro.
  mongoose.model<User>("User", UserSchema);


// Finally, default me UserModel export krenge
export default UserModel;
