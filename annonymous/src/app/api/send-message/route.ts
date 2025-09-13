// Chalo UserModel le aate hai
import UserModel from '@/model/User';

// database se connect bhi hona hoga. so, import kr lete hai.
import dbConnect from '@/lib/dbConnect';

// and hume ek aur model laagega, to ye message interface ko bhi import kr lete hai
// thoda type safety ke kaam aayega.
import { Message } from '@/model/User';



// cahlo ek post method ka function bana lete hai.
// request ka type define kr denge, Request
// and iss function ko yahi pe export bhi kr rahe hai.
// and db se connect hone me time laaga hai and "await"  use kiye h,
// so, iss function ko async baanaa hoga.
export async function POST(request: Request) {

    // Step 01: Databasae se connect kr lete hai. and connect hone me time laagega.
    // so await use kr lete hai.
    await dbConnect();

    // Now, ab acchi baat hai, ki messsage ko bhi send kr skta hai,
    // user ko logged in hone ki zarurat nahi h
    // So, hume abhi value leni hai, so value nikal lete hai (username and content ka)
    // request.json se.
    const { username, content } = await request.json();

    // Now, Ab hum try-catch laaga kr user ko find krenge.
    try {
        // to mera jo user model hai, wo find krega user using findone() method.
        // and isske ander parameter pass kr denge username.
        // and kyuki db se interract kr rahe hai, query run kr rahe hai, so time laagega
        // await use kr lete hai. and then value ko store kr denge. user variable me.

        const user = await UserModel.findOne({ username }).exec();

        // agar user nahi mila to.
        if (!user) {
            // ek json response send kr denge.
            // message me user not found and success : false
            // and status 404.
            return Response.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

      // user nahi mila hai, and message ko bhi accept nahi kr rahe hai
        if (!user.isAcceptingMessages) {
            // to ek json response send kr denge.
            return Response.json(
                { message: 'User is not accepting messages', success: false },
                { status: 403 } // 403 Forbidden status
            );
        }


    // Now, agar yaaha tak pahunch gye h, to mtlb user hai and user message bhi accept kr raha hai.
      // so, ek message craft krte hai.  
      // message jo hai wo mera object hoga {}, and isske ander 2 properties hoga 
      // 1st one is message ka content and , 2nd : Message kab create hua
      // Go to model/user and see Message interface , 2 hi property hai ussme.
        // createat me mujhe : new data() daalna hoga, so that every time.new date and time waala message show hoga.
      const newMessage = { content, createdAt: new Date() };

        
      // Now, Ab mera message ready hai with created date and time.
    // ab kaha iss message ko push krenge.
        // to ek kaam krte hai, user ke ander messages me hi push kr dete hai 
        // message as new Message
        // message ka data type already define hai, so hum new message jo bhej rahe hai.
        // wo same as message type ka bhej rahe hai.
        user.messages.push(newMessage as Message);
        // ab push ho gaya hai, so await laaga kr database me save kr do message.
        await user.save();

        // and agar save ho gya message database me, then 
        // ek json response send kr dete hai.
        return Response.json(
            { message: 'Message sent successfully', success: true },
            { status: 201 }
        );
        
    } catch (error) {
        console.error('Error adding message:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
