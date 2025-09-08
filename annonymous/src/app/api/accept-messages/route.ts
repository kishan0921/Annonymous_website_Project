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


// -------------------- POST API --------------------
// Ye POST method ka function hai.
// Iska kaam: User ke "isAcceptingMessages" status ko update karna.
export async function POST(request: Request) {
    // Step 1: DB connect karna (await lagana zaroori hai kyunki async hai)
    await dbConnect();

    // Step 2: Session nikalna (user login hai ya nahi check karne ke liye)
    const session = await getServerSession(authOptions);

    // Type hint diya taaki TypeScript ko samajh aaye ki session.user ek "User" hoga
    const user: User = session?.user;

    // Step 3: Agar session hi nahi mila ya user login nahi hai
    if (!session || !session.user) {
        return Response.json(
            { success: false, message: 'Not authenticated' }, // Response body
            { status: 401 } // Unauthorized
        );
    }

    // Step 4: Session se userId nikal lo (_id field)
    const userId = user._id;

    // Step 5: Request body me se "acceptMessages" field nikalna
    // Ye boolean hoga jo batayega ki user messages accept karna chahta hai ya nahi.
    const { acceptMessages } = await request.json();

    try {
        // Step 6: DB me user ko findByIdAndUpdate karo
        // - ID se user find karega
        // - isAcceptingMessages ko update karega
        // - { new: true } matlab updated document wapas return karega
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        );

        // Step 7: Agar user hi nahi mila update karne ke liye
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'Unable to find user to update message acceptance status',
                },
                { status: 404 } // Not Found
            );
        }

        // Step 8: Agar update successful hua
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



// -------------------- GET API --------------------
// Ye GET method ka function hai.
// Iska kaam: User ka "isAcceptingMessages" status fetch karna.
export async function GET(request: Request) {
    // Step 1: DB connect karna
    await dbConnect();

    // Step 2: Session nikalna (user login hai ya nahi check karne ke liye)
    const session = await getServerSession(authOptions);
    const user = session?.user;

    // Step 3: Agar session ya user hi nahi hai
    if (!session || !user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        // Step 4: DB me user ko find karo uske _id ke through
        const foundUser = await UserModel.findById(user._id);

        // Step 5: Agar user hi nahi mila
        if (!foundUser) {
            return Response.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Step 6: Agar user mil gaya, to uska "isAcceptingMessages" flag bhej do
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages,
            },
            { status: 200 } // OK
        );
    } catch (error) {
        // Step 7: Agar DB operation me error aaya
        console.error('Error retrieving message acceptance status:', error);
        return Response.json(
            { success: false, message: 'Error retrieving message acceptance status' },
            { status: 500 }
        );
    }
}
