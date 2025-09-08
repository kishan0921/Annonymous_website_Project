// NextAuth se server session nikalne ke liye import karte hai.
import { getServerSession } from 'next-auth/next';

// ye getServerSession apne aap nhi chalta, isse authOptions chahiye to import kr lete hai.
// Ye authOptions aapne [...nextauth]/options.ts me define kiya hoga.
// Isme NextAuth ka pura config hota hai (providers, callbacks, session, etc.)
import { authOptions } from '../auth/[...nextauth]/options';

// Database se connect hone ke liye helper function
import dbConnect from '@/lib/dbConnect';

// UserModel import kar liya, DB me User collection ke sath interact karne ke liye.
import UserModel from '@/model/User';

// TypeScript ke liye NextAuth se "User" type import.
// Taaki session.user ko type-safe banaya ja sake.
import { User } from 'next-auth';


// Ab mai accept message ke ander ek Post request banana chahunga,
// taaki jo currently logged in user hai wo toggle pe click krke accept ya decline kr skke message ko
// -------------------- POST API --------------------
// Ye POST method ka function hai.
// Iska kaam: User ke "isAcceptingMessages" status ko update karna.
// request ka type define kr denge, Request
export async function POST(request: Request) {
    // Step 1: DB connect karna (await lagana zaroori hai kyunki async hai)
    await dbConnect();

    // ab mujhe currenlty loggedin user chahiye. and authOptions ka use krenge
    // and pass kr denge getServerSession method me and session mil jaayega.
    // Step 2: Session nikalna (user login hai ya nahi check karne ke liye)
    const session = await getServerSession(authOptions);

    // now, session uppar to mil gya hai, but isska ye mtlb nhi h ki user mil gya hai.
    // ab hum session lete hai and hume pta hai,hum optionally nikal skte hai user from session.
    // and store kr diye user me,
    // Addtionally, yaha hum user ka type bta rahe hai: User hai. bass
    const user: User = session?.user;


    // Step 3: Agar session hi nahi mila ya user login nahi hai
    // mtlb user loggedin hi nahi hai.
    if (!session || !session.user) {
        // to ek json resposne send kr dete hai.
        return Response.json(
            { success: false, message: 'Not authenticated' }, // Response body
            { status: 401 } // Unauthorized
        );
    }

    // Step 4: Session se userId nikal lo (_id field)
    // ab mujhe database se interact krna hai, to mujhe chahiye user ka id 
    // to chalo user ka id nikal lete hai.
    // mera jo user hai usske ander ._id hoga woohi mera userid hai,
    // niakl liya and store kr liya hu userId variable me
    const userId = user._id;


    // Step 5: Request body me se "acceptMessages" field nikalna
    // Ye boolean hoga jo batayega ki user messages accept karna chahta hai ya nahi.

    // Story: jo backend waala banda hoga wo as acceptMessages(as flag) ka value bhejega like accept krna hai ya nhi.
    // hum acceptMessages (as flag) ka value nikal le rahe hai request.json se.
    const { acceptMessages } = await request.json();



    try {
        // Step 6: DB me user ko findByIdAndUpdate karo
        // - ID se user find karega
        // - isAcceptingMessages ko update karega
        // - { new: true } matlab updated document wapas return karega
        // yaha hum findByIdAndUpdate method ka use kr rahe hai.
        const updatedUser = await UserModel.findByIdAndUpdate(
            // then mujhe 1st parameter bhejna hoga like - userId
            // to isse userId find kr lega.
            userId,
            // and jo update krna h, wo bhej do like isAcceptingMessages me acceptMessages ka value jo bhi aayega wo update kr do Db me.
            { isAcceptingMessages: acceptMessages },
            // and update krne ke baaad new: true kr rahe hai , taaki new updated value mujhe mil jaaye.
            // Basically, new: true krne se return jo mujhe milega, wo updated value milega mujhe.
            { new: true }
        );

        // Step 7: Agar user hi nahi mila.
        if (!updatedUser) {
            // then json resposne send kr do.
            return Response.json(
                {
                    success: false,
                    message: 'Unable to find user to update message acceptance status',
                },
                { status: 404 } // Not Found
            );
        }

        // Step 8: Agar Databasae me User value successfully update ho gya h.
        // to ek json response send kr do.
        return Response.json(
            {
                success: true,
                message: 'Message acceptance status updated successfully',
                updatedUser, // updated user ka data wapas bhej diya
            },
            { status: 200 } // OK
        );
    } catch (error) {
        // Step 9: Agar DB operation me error aaya
        console.error('Error updating message acceptance status:', error);
        return Response.json(
            { success: false, message: 'Error updating message acceptance status' },
            { status: 500 } // Internal Server Error
        );
    }
}



// Ab hume GET request likhni hai, jo ki POST wali tarah hi hogi, 
// bas isme data update karne ki jagah sirf fetch (read) karna hai.
// -------------------- GET API --------------------

// Ye GET method ka function hai.
// Iska kaam: User ka "isAcceptingMessages" status fetch karna (pata lagana).
export async function GET(request: Request) {
    // Step 1: Database connect karna
    // Har API call me MongoDB ke sath connection ensure karna zaroori hota hai.
    await dbConnect();

    // Step 2: Session nikalna (user logged-in hai ya nahi check karne ke liye)
    // `getServerSession(authOptions)` hume current logged-in user ka session deta hai.
    const session = await getServerSession(authOptions);

    // Session ke andar ek `user` object hota hai (agar user login hai to).
    const user = session?.user;

    // Step 3: Agar session hi nahi mila ya user object hi missing hai
    // iska matlab hai ki user logged-in hi nahi hai.
    if (!session || !user) {
        return Response.json(
            {
                success: false,
                message: 'Not authenticated', // user login nahi hai
            },
            { status: 401 } // 401 -> Unauthorized
        );
    }

    try {
        // Step 4: Database me user ko search karo uske `_id` ke basis par
        // Session me hume user._id mila tha, ab hum us id ka use karke 
        // MongoDB me user ka document find karte hain.
        const foundUser = await UserModel.findById(user._id);

        // Step 5: Agar user DB me hi nahi mila
        // Ho sakta hai ki session to valid hai lekin DB se user delete ho gaya ho.
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found', // DB me user ka record nahi hai
                },
                { status: 404 } // 404 -> Not Found
            );
        }

        // Step 6: Agar user mil gaya
        // To hum sirf ek field `isAcceptingMessages` bhejte hain.
        // Ye frontend ko batayega ki user messages accept kar raha hai ya nahi.
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages,
            },
            { status: 200 } // 200 -> OK (sab sahi hai)
        );
    } catch (error) {
        // Step 7: Agar DB operation me error aaya (query fail ho gayi, connection issue, etc.)
        console.error('Error retrieving message acceptance status:', error);

        // Error hone par hum 500 -> Internal Server Error return karte hain.
        return Response.json(
            {
                success: false,
                message: 'Error retrieving message acceptance status',
            },
            { status: 500 }
        );
    }
}
