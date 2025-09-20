import UserModel from '@/model/User';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import { Message } from '@/model/User';
import { NextRequest } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/options';


// hum ek deleted function bana rahe hai, and export bhi kr rahe yahi pe.
// await use krenge, db connect krte time, so ye function async banega.
export async function DELETE(
    // Deltet method ke ander, request aapko milegi
    request: Request,
    // and request ke saath aapko, params bhi milega.
    // and params jo hoga usske and aapko milega, messageid ka type string rahega.
    { params }: { params: { messageid: string } }
) {
    // ab hum db connect hone se pehle hi messageId nikal liye hai.
    // ab aapke pass message id aa  gayi h, frontend se jo aapke bheja tha.
    const messageId = params.messageid;
    // Db connect kr dete hai, and Db dusre continent me h to time lagega.so await
    await dbConnect();
    // seesioon to lena hi hoga, auth options ke saath taaki mujhe pata chal jaaye kon sa user logged in h.
    const session = await getServerSession(authOptions);
    // then user le aaye hai, from session se.
    const _user: User = session?.user;

    // agar session nahi h, ya user nahi mila to hum json Response send kr denge. not authenticated.
    if (!session || !_user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }



    try {
        // ab await krenge , then Usermodel lenge and ussko bolenge aap updateOne use kro...kyu?
        //kyuki mujhe sirf, 1 value remove krni hai array se , so updateOne use krke wo ho jaayega.
        // and jo bhi Response aayega ussko hold kr lete hai, updateResult variable me.
        const updateResult = await UserModel.updateOne(
            // updateOne , puchega kiss basis pe mai , match kru Delete krne ke liye.
            // 1st parameter _id- id ke basis pe and ye aapko User._id se milegi
            { _id: _user._id },
            //2nd parameter - ab particular 1 array delete krna hai
            // doc  syntax - https://www.mongodb.com/docs/manual/reference/operator/update/pull/
            // dollar pull and then {} curly bracket ke ander condition pass kr do.
            // messages array me jaao (annonymous/src/model/User.ts  / then -  messages: Message[];)
            // message me chala gya, ab filtering kaise hoga ? 
            // message ke ander document pass ho rahe h, har document id ko message kro messageId se and 
            // then wo particular , then wo match hoga and delete ho jaayega.
            { $pull: { messages: { _id: messageId } } }
        );

        // ab particular check krna hoga, kuch update bhi hua ya nhi
        //updateResult ke ander , humare pass option aati h, modifiedCount and ye agar 0 hai.
        if (updateResult.modifiedCount === 0) {
            // to hum Response return kr denge.
            return Response.json(
                { message: 'Message not found or already deleted', success: false },
                { status: 404 }
            );
        }

        // agar messagecount , 0 nahi h and record delete ho gaya h, to Response send kr do like"Meesage deleted"
        return Response.json(
            { message: 'Message deleted', success: true },
            { status: 200 }
        );
    }
    // agar kuch error hai 
    catch (error) {
        console.error('Error deleting message:', error);
        return Response.json(
            { message: 'Error deleting message', success: false },
            { status: 500 }
        );
    }
}
