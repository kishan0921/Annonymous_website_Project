// // Why ?
// isska mtlb hai , ki ye component server pe nahi aayega,
// ye javascript shift krega browser pe and woha direct render hoga, and woha hum isse use krenge.
'use client'

// React le kar aayenge 
import React from 'react';
// link ka bhi use hoga
import Link from 'next/link';
// and mujhe useSession, signout method also, bhi chahiye, jo hum next-auth/react se le aayenge.
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
// user bhi le lete hai from next-auth se
import { User } from 'next-auth';

function Navbar() {

  // sabse pehle to hume data nikalna hai, and ye mujhe mil jaayega useSession se
  // and data ka type as session define kr diya hu.
  const { data: session } = useSession();
  // ab session me se user ke aa rahe hai and ye optional h, agar mila to thik nhi to null asigned ho jaayega error ni aayega.
  // and jo session se user milega usska type define kr diye h as User
  // Type define krne se hum 100 sure hai, ki ye next auth waala user hai.
  const user : User = session?.user;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          True Feedback
        </a>

        {/* // ab check krenge session hai ya nahi
        // hai to ? () - issme logic hoga 
        // nahi to : () - issme logic likha jaayega */}
        {session ? (
          // yaha tak aaye h mtlb session hai,mtlb logined hai
          <>
            <span className="mr-4">
              {/* welcome message show kr diye with user ka name ya email */}
              Welcome, {user?.username || user?.email}
            </span>

            {/* // ab next ek logout ka button show kr dete h */}
            <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
              Logout
            </Button>
          </>
        ) : (

          // yaha tak aaye h, mtlb session nahi hai, user logged in nahi h
          // logged in ka option show kr diye, and redirect kr diye / sign-in page pe
          <Link href="/sign-in">
            <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
