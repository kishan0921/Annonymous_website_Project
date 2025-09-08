// ye jo provider hai, actually me client components hota hai.
// so,
'use client';

// ab hume chahiye SessionProvider to import kr liye.
import { SessionProvider } from 'next-auth/react';


// ab ek function bana rahe hai AuthProvider and export bhi kr diye h.
export default function AuthProvider({
  children,
}: {
    // humare bas jo children aane waala hai usska type ek react ka node h
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}



