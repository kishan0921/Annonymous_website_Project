
// database se jo connect kiye the wo le laate hai connection.
import dbConnect from '@/lib/dbConnect';
// User model ka use hoga so ussko import kr lete hai.
import UserModel from '@/model/User';
// bcrypt ka use hoga so usko import kr lete hai
import bcrypt from 'bcryptjs';
// send verification email template ka use hoga, so import kr lete hai.
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';



// Aao jao ab , ek Post request banayenge.
// ab ye request kuch time lega, so async krna hoga
// and ye Post request hai, the hum POST() method ke ander request pass kr rahe hai
// and lastly, ye POST() method ko export kr diya h
export async function POST(request: Request) {

  // ab db se connect kr rahe hai, and db dusre continent me hai to await ka use kr rahe hai
  await dbConnect();

  
  try {
    // next.js me jab bhi aap data lete ho, request se to await use hoga hi.
    // request me aap ky ky field chahiye, ussko mai destructure kr diya hu and le raha hu
    // Like - username , email,password ye sab le raha hu request.json me 
    const { username, email, password } = await request.json();


    // Summary:
    //note: Case 1: User checking, with register email and verified true
    // then Case 2: User checking, with register email and verified false

    // Step 01: User Already Exists hai ya nahi check krenge.
    // mainly mujhe check krna hai ki, koi aisa user hai, jisska email register hai and verified bhi hai.
    
    
    // kaise find krre?
    // simple - UserModel ka use kro and mujhe isske ander findOne() method milta hai.
    // jo bhi result aayega, usse ek variable me store kr diya.
    const existingVerifiedUserByUsername = await UserModel.findOne({
      // ab findone ke humare 2 parameter hai.
      // first one ki username ke according find krna hai.
      // second one ki, wohi user dena mujhe, jisska username verified hai.
      username,
      isVerified: true,
    });


    //  Step 02: if user already exists, return error message

    // agar existingVerifiedUserByUsername ki value me kuch aaya hai, mtlb user already exists.
    if (existingVerifiedUserByUsername) {
      // to response return kr denge, json me 
      return Response.json(
        {
          // success: false, means error hai
          success: false,
          // message: 'User already exists'
          message: 'Username is already taken',
        },
        // status: 400 means bad request
        { status: 400 }
      );
    }



    // Step 03: User Already Exists hai ya nahi check krenge.
    // mainly mujhe check krna hai ki, koi aisa user hai, jisska email register hai and verified bhi nahi hai.  
    
    
    // chalo mainly find krte hai user based on register email.
    // UserModel ka use Krenge, then findOne() method ka use krenge, and email ke according find krnege
    // jo bhi result aayega, usse ek variable me store kr diya.
    const existingUserByEmail = await UserModel.findOne({ email });
    
    // verify code generate kr liye.
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // TODO: In this video but later.
    // Step 04: User Already Exists hai ya nahi check krenge.
    if (existingUserByEmail) {
      // existingUserByEmail hai, usske ander ek property hai isVerified check kr rahe hai
      if (existingUserByEmail.isVerified) {
        // agar isVerified true hai, mtlb user already exists
        // to hum ek json response return kr rahe hai
        return Response.json(
          {
            // success: false, means error hai
            success: false,
            // message: 'User already exists with this email'
            message: 'User already exists with this email',
          },
          // status: 400 means bad request
          { status: 400 }
        );
      } 
      else {
        // Case : existing user to hai, mtlb user already exists, but not verified
        // to hum user ko verify krenge.
        
        // Step 1: password encrypt krnege
        // bcrypt ka use krenge, and isske ander hash method ka use krenge,
        //  hash method ke ander password and salt pass kr diya h(10 rounds)
        // time lega ye process krne me to await then jo value aayega ussko store kr diye h hashedPassword me.
        const hashedPassword = await bcrypt.hash(password, 10);
      
        //ab hum jo hash password aayega usko existingUserByEmail ke ander password me override/store kr diye h 
        existingUserByEmail.password = hashedPassword;
        // verifiedcode bhi change kr diye hai. ye exisitingUserByEmail user ka.
        existingUserByEmail.verifyCode = verifyCode;
        // verify code expiry time bhi change kr diya hu.
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        
        
        // Lastly, iss user ko hum save kr diye hai, database me and db me save hone me time leega, so await use kr liye h
        await existingUserByEmail.save();
      }
    } else {
        // mtlb yaha pe user ka email nahi mila hai,mtlb user register nhi h to register krenge.
        // aao user register krte hai , database ke ander.

        // Step 1: password encrypt krnege
        // bcrypt ka use krenge, and isske ander hash method ka use krenge,
        //  hash method ke ander password and salt pass kr diya h(10 rounds)
        // time lega ye process krne me to await then jo value aayega ussko store kr diye h hashedPassword me.
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // humne model ke ander verifiedcode expiry add kiya tha, so ussko add kr rahe h 
      // present date select kr rahe hai. using new Date() se.
      const expiryDate = new Date();
      // date mil gaya then 1 hour ka expiry set kr rahe hai.
      expiryDate.setHours(expiryDate.getHours() + 1);


      // Step 2: ab jo bhi detail hai ussko database me save krnege
      // to ek new user banayenge and usko database me save krnege
      const newUser = new UserModel({
        // username as it is username hi liya hai humne means no name change.
        username,
        // email as it is email hi liya hai humne means no name change.
        email,
        // password as hashedPassword liya hai humne.
        password: hashedPassword,
        // verifycode as verifyCode liya hai humne
        verifyCode,
        //verifyCodeExpiry as expiryDate liya hai humne
        verifyCodeExpiry: expiryDate,
        // isVerified as false liya hai humne.
        isVerified: false,
        // isAcceptingMessages as true liya hai humne
        isAcceptingMessages: true,
        // messages mera default value empty hai
        messages: [],
      });

      // ab newUser ko database me save krnege using save() method 
      // and offcurse save() method time lega, so await use kr liye.
      await newUser.save();
    }

    // continue......... after await newUser.save();
    // Send verification email
    // email response send krna hai, to sendVerificationEmail ka use krenge
    // and isske ander email, username and verifyCode pass kr diya hai
    // and ye sab value jo aaygea, wo emailResponse me store kr diya.
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    // if emailResponse me success false hua to error aayega
    if (!emailResponse.success) {
      // and then hum ek json response return krenge
      return Response.json(
        {
          // success false hoga
          success: false,
          // error message print krne ke liye
          message: emailResponse.message,
        },
        // and status 500 hoga send kr diya hu
        { status: 500 }
      );
    }

  // if emailResponse me success true hua to success message print krne ke liye
  // and then Response return kr diya hu.
  // and hummne success me koi condition check nhi krna pada hai.
    return Response.json(
      {
        // success true hoga
        success: true,
        // success message print krne ke liye
        message: 'User registered successfully. Please verify your account.',
      },
      // and status 201 hoga send kr diya hu
      { status: 201 }
    );
  } catch (error) {
    // Agar user register nahi hua to error aayega
    // console pe error print krenge , and error value bhi show kr diye.
    console.error('Error registering user:', error);

    // and then Response return kr diya hu.
    return Response.json(
      {
        // success false hoga
        success: false,
        // error message print krne ke liye
        message: 'Error registering user',
      },
      // and status 500 hoga send kr diya hu
      { status: 500 }
    );
  }
}
