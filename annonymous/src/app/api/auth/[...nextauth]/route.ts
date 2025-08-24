// https://authjs.dev/getting-started/installation?framework=Next.js
// code copy from here.

// Next auth import kr lete hai from next-auth
import NextAuth from 'next-auth/next';
// options import kr lete hai
import { authOptions } from './options';



const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };