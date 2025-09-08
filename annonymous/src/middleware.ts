// Documentation - https://nextjs.org/docs/14/app/building-your-application/routing/middleware


// Mai NextRequest and NextResponse le leta hu, jo ki mujhe sidha next ke server se mil jaayega.
import { NextRequest, NextResponse } from 'next/server';
//ab mujhe token ka bhi use hoga,
// and mujhe jaha bhi token use krna hoga then hum aise import krenge.
import { getToken } from 'next-auth/jwt';
// note: the most simple usage is when you want to require auth for your entire site.  you can add a middleware.js file with the following.
// ye to chahiye hi, jab mujhe middleware ko run krna hai to
// yaha default mtlb hai, sabhi jagah hum middleware chala rahe h.
export { default } from 'next-auth/middleware';


// Note: Most IMPORTANT !
// Ye config , wo file hai jissme hum batate hai middle ware ko ki,
// kaha kaha hum middleware ko run krna chahte hai.wo sbka path hum config me likhte hai.
export const config = {
    // config ke ander matcher hota hai.
    // and kyuki hume kahi jagah middle ware ko run krna hai, to hum ek 
    // array bana lete hai and then uss array me sab paath likh denge.
    matcher: [
        // jaaha jaaha hume middle ware run krna h , usska path daal do.
        // yaha /:path* - *(astrick bolte hai) and :path ke baath jitne paath hoga sb pe hum middleware use kr skte h.
        '/dashboard/:path*',
        '/sign-in',
        '/sign-up',
        '/',
        '/verify/:path*'],
};



// ab actually jo middleware ka wokring hai, wo ye "middleware" method hi krega.
// niche getToken ka use krke token laaye h, and ussme time laaga hai, so await use kiye h, so mujhe ye middleware function ko async banana hoga.
export async function middleware(request: NextRequest) {
    // Ab mujhe 2 chiz chahiye.
    //1.token- isse mujhe pta chahlega ki aap website pe kaha pe ho.
    //2. url - then url chahiye and isska use krke mai aapko kisi url pe redirect krunga.

    // chalo token laate hai. using getToken method se and token laane me time lagega, so await use kr lete hai
    // now getToken method ke ander hume paramerter dena hoga.
    // paramerter ke ander req de rahe hai , and isska type bhi define kr rahe hai. like req:request hai.
    const token = await getToken({ req: request });

    // ab token aa chuka h mere pass,
    // ab current url bhi jaana hoga. so,request.nextUrl se mujhe current user ka url mil gaaya.
    const url = request.nextUrl;



    // Step : ab mujhe check krna hoga
    //1. toekn hai to hum kaha kaha jaa skte hai and 
    //2.token nhi hai to kaha kaha jaa rahe hai.

    // Redirect to dashboard if the user is already authenticated
    // and trying to access sign-in, sign-up, or home page
    if (
        // agar mere pass token hai
        token &&
        // to hum kaha kaha jaana chah rahe hai, usske url ke paramter define kr dete hai.

        // agar url ka pathname start ho raha hai /sign-in se and token hai to hum redirect kr denge /dashboard jo ki return me likha hua h.
        (url.pathname.startsWith('/sign-in') ||
            // sign-up waale page pe bhi nhi jaao, kyuki token hai mere pass , to redirect kr rahe hai user ko /dashboard pe
            url.pathname.startsWith('/sign-up') ||
            // /verify pe bhi mt jaao, kyuki token hai mere pass, direct redirect kr do /dashboard pe
            url.pathname.startsWith('/verify') ||
            // aisa case bhi aaye to direct redirect kr do, /dashboard waale page pe.
            url.pathname === '/')
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }


    // agar token nahi hai 
    if (!token &&
        // and hum /dashboard waale path pe hai, and token to hai hi nahi na to hum redirect kr denge. /sign-in waale path pe
        url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}
