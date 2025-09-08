

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";



// Ab kyuki validation ke liye mere, pass usernameValidation schema hai.
// to ab hum ek query schema banayenge.


// z- zod jo hai wo hume deta hai, ek obejct
const usernameQuerySchema = z.object({
    // and object ke ander hum parameter le lete hai.
    // like - username ,
    // ab username jo hai wo full fil krna chahiye mere, username Validation ko
    username: usernameValidation
})

// Ab mujhe ek simple sa, get Method likhna hai,jisse mujhe agar koi bhi 
// user apna username bheje to mai check krke uss user ko bata skku apna username valid h, ya nahi.
// ya username exist krta hai, ya nahi.
// jab signup krta hai wo uss time to check krte hi h,by sending all username detail.
// Note: but mainly suppose signup waale page pe user hai, and jab user, apna username likhta hai.
// and mai wohi show krna chahta hu usse to issliye ye method likhunga.

// ek function bana rahe hai Get and type bhi check kr liye like 
// request : Request hona chahiye. and iss function ko export bhi kr de rahe h yahi pe.
// and await use kiya hu database se connect krne ke liye , so async function banana hoga.
export async function GET(request: Request) {

    // database se connect kr lete hai.
    await dbConnect()


    // Chalo username check krte hai?
    // Username jo hai wo hum check krenge "URL" se.
    // koi bhi username check krega to hume ek query bhej dega, url ke ander
    // to query parameter mujhe extract krna hai .... ? krke aayega url me
    try {

        // Step 01: Query parameter mujhe extract krna hai.
        // chalo url le aate hai. 
        // nextjs me URL method ka use kro and new keyword ka use kro and 
        // request.url se mere pass full url aa gya and isse mai bol deta hu 
        // searchParams
        const { searchParams } = new URL(request.url)
        // ab iss searchParams me bahut saari queries aayi hogi ...? krke
        // but, mujhe sirf apni username waali query nikalni h
        const queryParam = {
            // ab queryParam nikaleha kaise? 
            // username se  and username kaise aayega ?
            // aap searchParams(url) me se GET kro and ko chahiye usska name likh do 
            // like yaha mujhe username chahiye. to get('username') kr diya.
            // now, url kaisa hoga ? chalo dekhte hai .....uppar 
            // localhost:3000/api/cuu?username=hitest?phone=android
            // mujhe url se sirf username = hitest chahiye tha.jo le liye mai
            username: searchParams.get('username')
        }

        // Step 03: queryParam ke ander mere pass username ki value h.
        // now, queryParam(username) ko validate krna hai mujhe.
        // to hum zod use kr lenge.

        // usernameQuerySchema lo and then safeparse(bahut baar use hota hai) ye method
        //and then safeparse method ke ander queryParam de do... validate/check ho jaayega.
        // and jo result aayega ussko hold kr lete hu. result variable me.
        // agar valid username hua to value milegi, warna hi.
        const result = usernameQuerySchema.safeparse(queryParam)

        //result ko console krke dekh lete hai.
        // console.log(result) // TODO : Remove

        // agar validation successful na ho.
        if (!result.success) {
            // to actual jo error hai ussko format way me and zod ke ander saara error rahta hai,
            // but mujhe particular username waala error show krna hai, and ?. (chaining operator ka use krenge)
            // kyuki error ho bhi skta hai ya nhi bhi. hoga to show kr dega, warna null assigned ho jaayega.
            // In short : format().username?.errors (result me se error nikal kr uss error ko format kr liye)
            // and particular username waala error show kr diya and nahi mila to [] empty show kr diye.
            // and error waala value usernameErrors variable me store kr liye.
            const usernameErrors = result.error.format().username?.errors || []

            // now, ek json Response bhi return kr dete hai. detail me
            return Response.json({
                success: false,
                // yaha message me agar usernameErrors ki length 0 se zaada h, to hum 
                // saare error ko (,) laaga kr show kr denge.
                message: usernameErrors?.length > 0
                    ? usernameErrors.join(', ')
                    // warna agar =<0 hai, then direct message show kr denge.
                    : 'Invalid query parameters',
            },
                // and status 400 bhej denge.
                { status: 400 })
        }

        // agar validation successful hai. to ek baar pura detail store kr lete h.
        // and print krke bhi dekh skte ho, issliye store kr rahe hai.
        const { username } = result.data

        // Now, yaaha tak aa gye to mtlb username jo hai successfully validate ho gya hai.
        // ab to bass woohi normal process follow krenge.like-
        // database se le kar aao and query kro etc-


        // ye UserModel liye, database me se try krenge find krne ka using findOne() method ka use krke
        // kyuki database query hai, to time laaga, issliye await
        // then store kr lenge value existingVerifiedUser variable me
        const existingVerifiedUser = await UserModel.findOne(
            // findOne ke ander 2 parameter lenge like - username, isVerified true hoga chahiye.
            { username, isVerified: true }
        )

        // agar existingVerifiedUser mila hai then
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: 'Username is already taken'
            }, { status: 400 })
        }

        // and agar existingVerifiedUser nahi mila hai then,
        return Response.json({
            success: true,
            message: 'Username is Unique'
        }, { status: 400 })
    }
    // Agar error aata hai to catch handle kr lega.
    catch (error) {
        // error aane pe Message print kr diye hai, console pe
        console.error("Error Checking username", error)
        // and ek json Response bhi print kr denge, console pe
        return Response.json(
            {
                // json me success false show hoga.
                success: false,
                // and message ye show hoga.
                message: "Error Checking username"
            },
            // and status false waala. like - 500
            { status: 500 }
        )
    }
}
