// -------------------- IMPORTS --------------------
import dbConnect from '@/lib/dbConnect';
// MongoDB se connect karne ke liye helper function

import UserModel from '@/model/User';
// Ye Mongoose model hai "User" collection ka (jo DB me bana hai)

import mongoose from 'mongoose';
// MongoDB ke ObjectId banane ke liye (aggregation pipeline me use hota hai)

import { User } from 'next-auth';
// next-auth ka "User" type (jo session ke andar user object hota hai)

import { getServerSession } from 'next-auth/next';
// next-auth ka method jo currently logged-in user ka session deta hai

import { authOptions } from '../auth/[...nextauth]/options';
// next-auth ka configuration (providers, callbacks, etc.)


// -------------------- GET API --------------------
// Ye API ka kaam: Logged-in user ke messages fetch karna
// Messages ko latest → oldest order (descending) me bhejna


// aao ek Get function bana lete hai, and isska request ka type Request ho define bhi kar dete hai.
// Database se connect hone me await ka use kiya hu, so function async hoga. 
// and ye function yahi pe export bhi kar diya hu.
export async function GET(request: Request) {
    // Step 1: Database se connect karo
    await dbConnect();

    // Step 2: Session nikaalo (check karo user login hai ya nahi)
    // getServerSession method ke ander (authOptions) pass kr diya hu 
    // and particular authOptions se session nikal kr session variable me store kr liya hu.
    const session = await getServerSession(authOptions);

    // Agar session hai to uske andar ek "user" object hoga
    // ab session ke ander se user nikal liya hu. and user varaible me store kr liya hu.
    // and User ka type User de define kr liya hu.
    const _user: User = session?.user;

    // Step 3: Agar session hi nahi mila ya user null hai (mtlb user logged-in nahi hai)
    if (!session || !_user) {
        // to json response send kr raha hu.
        return Response.json(
            { success: false, message: 'Not authenticated' }, // Response body
            { status: 401 } // 401 Unauthorized
        );
    }


    // Now, Earlier we used :
    // const userId = user._id;  ye problem krega jab hum aggregate pipeline use krenge.
    // So, hume isske convert krna hoga.

    // Step 4: User ka _id MongoDB ke ObjectId format me convert karo
    // Aggregation pipeline me ObjectId ki zarurat hoti hai

    // Note : Jab bhi aggregation use hoga, to aise hi [ObjectId] me chahiye hoga hume.
    // Now, User ka id mujhe mil gya hai, user._id se
    // hum new use krenge, then hum lenge mongoose and mongoose ko bolenge 
    // types dena and then ObjectId and then (user._id pass kr denge)
    // convert hokar mongoose ObjectId ke form me jaayega 
    // { _id: "66e2e8c2f3a9d23b4c9e1a5d" } ❌  (string)
    // { _id: ObjectId("66e2e8c2f3a9d23b4c9e1a5d") } ✅ (ObjectId)
    const userId = new mongoose.Types.ObjectId(_user._id);

    try {
        // Step 5: Aggregation pipeline lagana
        // Isse user ke messages nikalenge aur unhe descending order me sort karenge

        // Now, Target : hai mujhe saare message ko laana hai user ke ander.
        // aggregate pipeline banane ke liye aggregate() method ka use krenge.
        const user = await UserModel.aggregate([
            // then isske ander array banate h, and then {}, {} pipeline add krte jaate h

            // 1st pipeline
            // ab kyuki bahut saare user ho skte hai, to mujhe match krwane hai.
            // waise user jisski id match ho.
            // 5.1: Pehle user ko filter karo _id ke basis par
            { $match: { _id: userId } },

            // -------------------- 2nd Pipeline Stage --------------------
            // Ab next step me hume user ke "messages" array ke sath kaam karna hai.
            // Problem: "messages" ek array hai, aur agar hume uske andar ke elements ko individually 
            // sort ya filter karna hai to wo directly possible nahi hai.
            // Solution: MongoDB ka "$unwind" operator use karte hain.
            //
            // "$unwind" ka kaam: 
            // - Ye array ko tod deta hai, aur har ek element ko ek alag document bana deta hai.
            // - Matlab agar ek user ke paas 3 messages hain, to 1 document ki jagah 
            //   ab 3 documents ban jaayenge (same user._id ke sath).
            //
            // Example before $unwind:
            // {
            //   "_id": "123",
            //   "username": "kishan",
            //   "messages": [
            //     { "text": "Hello", "createdAt": "2025-09-01" },
            //     { "text": "How are you?", "createdAt": "2025-09-02" }
            //   ]
            // }
            //
            // After $unwind:
            // { "_id": "123", "messages": { "text": "Hello", "createdAt": "2025-09-01" } }
            // { "_id": "123", "messages": { "text": "How are you?", "createdAt": "2025-09-02" } }
            //
            // Ab har ek message alag document ban gaya hai.
            // Isse hume benefit milega:
            // - Hum "messages.createdAt" ke basis pe easily sort kar paayenge.
            // - Hum baad me group karke dobara ek array bana lenge.
            //
            // Conclusion: $unwind lagana zaroori hai agar aapko array ke andar ke 
            // elements ke upar aggregation operations (sort, filter, group) apply karne hain.
            { $unwind: '$messages' },


            // -------------------- 3rd Pipeline Stage --------------------
            // "$sort" se saare messages ko "createdAt" ke basis par arrange karenge.
            // -1 => descending order (latest → oldest).
            //
            // Example:
            // Pehle (unsorted):
            //   Hello (1 Sep), How are you? (2 Sep), Welcome! (3 Sep)
            //
            // Baad me (sorted):
            //   Welcome! (3 Sep), How are you? (2 Sep), Hello (1 Sep)
            //
            // Matlab ab hamesha naya message sabse upar aayega.
            { $sort: { 'messages.createdAt': -1 } },


            // -------------------- 4th Pipeline Stage --------------------
            // "$group" ka kaam: dobara saare messages ek hi user ke liye group karna
            // Aur sorted messages ko ek array me push karna.
            //
            // Example (after $unwind + $sort):
            // { "_id": "123", "messages": { "text": "Welcome!", "createdAt": "3 Sep" } }
            // { "_id": "123", "messages": { "text": "How are you?", "createdAt": "2 Sep" } }
            // { "_id": "123", "messages": { "text": "Hello", "createdAt": "1 Sep" } }
            //
            // After $group:
            // { "_id": "123", "messages": [
            //     { "text": "Welcome!", "createdAt": "3 Sep" },
            //     { "text": "How are you?", "createdAt": "2 Sep" },
            //     { "text": "Hello", "createdAt": "1 Sep" }
            // ] }
            //
            // Matlab:
            // - Messages ab dobara ek hi array me aa gaye hain
            // - Array ab latest → oldest order me sorted hai
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },

        ]).exec();  // Execute the aggregation and return a Promise

        // Step 6: Agar user mila hi nahi, and ya fir user jo hai usska length ==0 hai 
        if (!user || user.length === 0) {
            // to ek json response send kar do.
            return Response.json(
                { success: false, message: 'User not found' },
                { status: 404 } // 404 Not Found
            );
        }

        // Step 7: Agar user mil gaya aur messages bhi hain
        return Response.json({
            success: true,                   // Request successful
            messages: user[0].messages       // Aggregation se mila sorted messages array
        },
            { status: 200 }                      // HTTP status 200 OK
        );
    } catch (error) {
        // Step 8: Agar DB query/aggregation me koi error aaya
        console.error('An unexpected error occurred:', error);

        return Response.json(
            { success: false, message: 'Internal server error' },
            { status: 500 } // 500 Internal Server Error
        );
    }
}
