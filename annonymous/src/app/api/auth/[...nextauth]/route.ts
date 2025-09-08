// https://authjs.dev/getting-started/installation?framework=Next.js
// code copy from here.

// Next auth import kr lete hai from next-auth
import NextAuth from 'next-auth/next';
// options import kr lete hai
import { authOptions } from './options';


// Ab humara kaam hai ki , hume ek handler variable banao and 
// Note :NextAuth ek method hai jo option leta hai 
//then NextAuth method ka use karke authOptions (mtlb saare options pass kr diya hua
// jo bhi options.ts file me hai )
const handler = NextAuth(authOptions);


// export kr lete hai, handler ko as GET and same Handler ko export kr lete hai as POST also.
export { handler as GET, handler as POST };