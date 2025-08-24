// basically, verification send krne ka template bana rahe hai


// resend import kr rahe hai , apne waala resend.ts file ka
import { resend } from "@/lib/resend";

// Jo verification email send krne ka template hai, ussko import kr lete hai.
import VerificationEmail from "../../emails/VerificationEmail";
// api ka response bhi bejne waale hai , to ussko bhi standard bana rahe hai. and yaha import kr rahe h
import { ApiResponse } from '@/types/ApiResponse';


// Ab mujhe ek verification email send krna h


// ek function bana rahe hai jo ki asynch hai, kyuki ye process me time laagega.
// and iss function ko export bhi rk rahe hai.
export async function sendVerificationEmail(
    // sendVerificationEmail ke ander hum data le rahe hai. jo ki required hoga email send krne ke liye.
    // like email and usska type string hona chahiye
  email: string,
  // like username and usska type string hona chahiye
  username: string,
  // like verifyCode and usska type string hona chahiye
  verifyCode: string
): Promise<ApiResponse> 
// and jab ye process execute ho jaayega then kuch return me milega kuch.
// and hum retrun ka type yaah pe define kr rahe hai , as promise and aisa waise promise nahi, already define hai ApiResponse waala.
{


  try {
    // now, thesse 5 line copy paste. from Resend documentation
    await resend.emails.send({
        // kon se email user se email send krna hai.
      from: 'dev@hiteshchoudhary.com',
      // kissko email send krna hai, wo mail "email" parameter me pass krunga.
      to: email,
      // email ka subject pass kr rahe hai
      subject: 'Mystery Message Verification Code',
      // ab yaha bol raha hai. react means kon se component show krna chahte ho.
      // to mai VerificationEmail waala component me redirect krna chahta hu.
      //and also as prop hum  username and otps: verifyCode pass kr rahe hai, and top ka name change rakha hai- as verifyCode sab pass kr rahe hai.
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    // agar email send ho gaya h to ApiResponse me true and success message return kr diya
    return { success: true, message: 'Verification email sent successfully.' };
  } 
  // agar email send hone me error hoga to catch block me handle ho jaayega.
  catch (emailError) {
    // and error print kr diya
    console.error('Error sending verification email:', emailError);
    // and ApiResponse me false and error message return kr diya
    return { success: false, message: 'Failed to send verification email.' };
  }
}
