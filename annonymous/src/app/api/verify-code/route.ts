
// Note: Simillar code as check-username-unique/ route.ts yaha GET ka tha and yaha POST ka hai.

// database se connect hone ke liye
import dbConnect from '@/lib/dbConnect';

// Usermodel import kr lete hai, baad me DB se interact krke User find krna hoga issliye.
import UserModel from '@/model/User';


// check-username-unique/ route.ts me GET ka function banaya tha same waise hi issme banayenge 

// ek function bana rahe hai POST and type bhi check kr liye like 
// request : Request hona chahiye. and iss function ko export bhi kr de rahe h yahi pe.
// and await use kiya hu database se connect krne ke liye , so async function banana hoga.
// verify code, pura jo method hai wo hum GET se bhi kr skte hai and post se bhi.
// But yaha hum POST se kr rahe hai.
export async function POST(request: Request) {
    //Connect to the database and DB se connect hone me time lagega so, await use kr liye.
    await dbConnect();




    // Ab validation ka part hai to try-catch use kr lete hai.
    try {
        // ab mujhe chahiye data. username and code ka data hum le rahe hai. request.json () se
        // data bheje hai hum request.json se and hum ussme se username , code ka data extract kr liye hai.
        const { username, code } = await request.json();

        // ye krna utna imp nhi h, but kr lete h 
        // Jab URL ke andar space ya special characters hote hain,
        // to browser unko encode karke % ke format me convert kar deta hai.
        // Example01: "john doe" → "john%20doe"
        // decodeURIComponent() un encoded values ko wapas
        // normal readable string me convert kar deta hai.
        // Example02: "john%20doe" → "john doe"
        const decodedUsername = decodeURIComponent(username);


        // Database (MongoDB) ke andar 'UserModel' collection me search kar raha hai.
        // Search condition: jiska 'username' field 'decodedUsername' ke equal ho.
        // Agar aisa user milta hai to usko return karega, warna null dega.
        //
        // Example:
        // decodedUsername = "john doe"
        // To query banegi: { username: "john doe" }
        // Aur agar DB me aisa user hai, to uska pura document 'user' me store ho jayega.
        const user = await UserModel.findOne({ username: decodedUsername });

        // agar user nahi mila hai
        if (!user) {
            // then json response send kr do.
            return Response.json(
                // success false kr do and message send kr do 
                { success: false, message: 'User not found' },
                // and status bhi send kar do. 404
                { status: 404 }
            );
        }


        // Now, Agar user mila hai to check krna hoga 
        // 01- code correct hai ya nahi 
        // 02- Code ki expiry date zaada honi chahiye.

        // chalo code check krte hai valid hai ya nhi. 
        // user to mera mil hi gya hai usske ander se verifyCode le lo and compare kr lo abhi waale code se.
        // ye waala jo uppar liya h - const { username, code } = await request.json(); 
        const isCodeValid = user.verifyCode === code;

        // Yaha check ho raha hai ki user ka verification code abhi valid hai ya expire ho chuka hai.
        // user.verifyCodeExpiry → wo date/time hai jab tak code valid hai.
        // new Date(user.verifyCodeExpiry) → expiry date ko Date object me convert kiya.
        // new Date() → current system date/time.
        // Agar expiry date current date se aage hai to matlab code abhi valid hai.
        // Result true/false me aayega aur 'isCodeNotExpired' me store hoga.
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();


        // now, ab agar 
        // 01- code correct hai, mtlb user verified hai.
        // 02- Code expired nahi hai.
        if (isCodeValid && isCodeNotExpired) {
            //Dono condition true hai, then ab hum user ki value change kr denge. 
            //user ki verified value true kr denge.
            user.isVerified = true;
            // and then save krwa diye updated user detail in DB
            await user.save();

            // and then json resposne bhi send kr dete hai.
            return Response.json(
                // success true, and message 
                { success: true, message: 'Account verified successfully' },
                // and status : 200 mtlb OK
                { status: 200 }
            );
        }
        // Now, Ab hum 2 case dekhenge-
        // 01- agar code expired hai
        // 02 - agar code incorrect hai
        // agar code expired hai
        else if (!isCodeNotExpired) {
            // to hum ek json response send kr rahe hai.
            return Response.json(
                {
                    // success : false 
                    success: false,
                    // error message bhej diya hu.
                    message:
                        'Verification code has expired. Please sign up again to get a new code.',
                },
                // and status : 400 
                { status: 400 }
            );
        } else {
            // 02 - agar code incorrect hai
            // to hum ek json response send kr rahe hai.
            return Response.json(
                { success: false, message: 'Incorrect verification code' },
                { status: 400 }
            );
        }
    }
    // Agar error aata hai to catch handle kr lega.
    catch (error) {
        // console me error print kr diye and error bhej diye.
        console.error('Error verifying user:', error);
        // and ek json response bhi send kr rahe hai.
        return Response.json(
            // success, false bhej rahe hai and message bhi bhej rahe hai json me.
            { success: false, message: 'Error verifying user' },
            // status bhi bhej rahe hai.
            { status: 500 }
        );
    }
}
