'use client'; 
// 🔹 Next.js me default components "server components" hote hain (jo server pe run hote hain).
// 🔹 Lekin is form me hum use kar rahe hain: useState, useEffect, react-hook-form, etc. 
// 🔹 Ye sab sirf client-side (browser) pe kaam karte hain.
// 👉 Isliye file ke top pe "use client" likhna mandatory hai.


// zod resolver and useform to lagega hi laagega.
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';


import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Linkage bhi laagega hi laagega, to next se le laate hai.
import Link from 'next/link';
// use router import kr lete h, kyuki user ko idhar udhar to bhejenge hi
import { useRouter } from 'next/navigation';
// toast package install ho gya , now import kr liye
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';


export default function SignInForm() {

  // use router bhi use kr lete h, kyuki user ko idhar udhar to bhejenge hi
  const router = useRouter();
  // Ab yaha hum useform ka use krenge, 
  // Bole to Zod implementation
  // yaha form variable ka name kuch bhi use kr skte hai,example-
  // kuch log , register bolte hai, kuch log form
  // Doc - https://react-hook-form.com/get-started
  
  // ab kyuki typescript use kr rahe hai, so useForm me <> (typescript inject kr dete h)
  // ki ye jo z. hai ye infer kr skta hai ki isske pass kis type ki value aayegi 
  // like here - jo value aayegi usska typeof h "signUpSchema" type ki
  // isse 100% sure ho jaata hai ki, from ka jo resolver value dega wo typeof signUpSchema 
  // value ko follow kregi
  const form = useForm<z.infer<typeof signInSchema>>({
    // Ab useForm ke ander hum resolver add kr skte hai.
    // ye rahe mere resolver option, ab aape depend krta hai kaise resolver use krna cahhte h
    // Mereko yaha abhi, zodResolver use krna hai.
    // zodResolver() - appne aap me kaam nhi krta , issko chahiye ek schema (eg-signUpSchema)
    resolver: zodResolver(signInSchema),
    // ek aur step hota hai, like - form ki default state kaisi rahegi.
    // to yaha aapko 1 aur value milti h, default value ka
    defaultValues: {
        // aab ky ky control krna hai, wo aappe hai.
        // form ka default value me, username,email,password sab empty h
      identifier: '', // By default empty
      password: '', // By default empty
    },
  });


    // and yaha hum toast ko initiate kr diye
  // Note: () - parenthesis
  const { toast } = useToast();

  // ab actually me baatate , form jab submit hoga to ky krna hai.
  // ab sikhte hai, submit method kaise work krega.
  // aapko ek method define krna hoga , dgar document follow kro to handleSubmit ki tarah,
  // so hum onSubmit name ka method bana lete h 
  // onSubmit ab hogya mera async and then () =>{} mera callback ready h
  // Ab async ke ander mujhe milta h, data
  // ab jo ye data hai, issko hum inter krwa skte hai , using zod
  // repeated line aayega ab : same use hua h uppar (const form = useForm)
  // ab kyuki typescript use kr rahe hai, so useForm me <> (typescript inject kr dete h)
  // ki ye jo z. hai ye infer kr skta hai ki isske pass kis type ki value aayegi 
  // like here - jo value aayegi usska typeof h "signUpSchema" type ki h
  // isse 100% sure ho jaata hai ki, from ka jo resolver value dega wo typeof signUpSchema 
  // value ko follow kregi
  const onSubmit = async (data : z.infer<typeof signInSchema>)=>{
// Logical part complete ho gya h mera yaha pe
// ab hum axios nahi use krenge jaise signup me use kiya tha, 
// hum direct signIn use krenge jo ki direct nextauth se aata hai
// signIn issko 2 parameter chahiye, 1st - kon sa provider (credentials provider hum use kr rahe h)
// 2nd hume data send krna hoga, {like - redirect,identifier,password} 
const result = await signIn('credentials', {
  redirect: false,
  // data.identifier ka value bhej rahe h
  identifier: data.identifier,
  password: data.password,
  });

// ab result me mera error bhi aa skta hai, ya sab kuch thik bhi rah skta h
// hum dekh rahe hai, optionally kahi error to nahi h na
    if(result?.error){
      // yaha tak aaye hai mtlb error hai, and now, check krenge kahi ye error CredentialsSignin waala to nahi h na
      if (result.error === 'CredentialsSignin') {
        // agar hai CredentialsSignin, waala error to toast show kr denge error ka
      // ab mera response aa chuka h, and sabkuch thik hai to user ko ek toast "Success" waala show kr dete h
      toast({
        // toast ke ander hume kaafi option milte hai, like - title, descript use kr raha hu.
        title: 'Login Failed',
        // description jo h mera, wo response ke ander data me ander message me rahega.
        description: "Incorrect username or password",
        //and mera 2 types veraint hai, default and destructive so, hum destructive use kiye h yaha pe
        variant:"destructive"
      });
    }else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
  }

  // agar mujhe result ke ander url milta hai, optional rakhe hue h
  // result milta hai , mtlb hum sign in hai, then hum user ko redirect kr denge , / dashboard pe
  // router . replace/redirect ka use krke
  if (result?.url) {
    router.replace('/dashboard');
    }
  };
// ab mujhe frontend pe bhi deal/ handle krna hoga 
return (
  <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Welcome Back to True Feedback
        </h1>
        <p className="mb-4">Sign in to continue your secret conversations</p>
      </div>

      {/* Main part */}
      {/* Go and Revise from - annonymous/src/app/(auth)/sign-up/page.tsx */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="identifier"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email/Username</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <Input type="password" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className='w-full' type="submit">Sign In</Button>
        </form>
      </Form>


      {/* form ke and me  agar aap already member ho to sign in add kr diya hu*/}
      <div className="text-center mt-4">
        <p>
          Not a member yet?{' '}
          <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  </div>
);
}

