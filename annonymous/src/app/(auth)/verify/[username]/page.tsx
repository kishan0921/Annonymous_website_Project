// OTP verify waala logic dekhenge.

'use client'; 
// ✅ Ye Next.js ka special directive hai jo batata hai ki ye component client side pe chalega (browser me).
// By default Next.js 13 me server components hote hain, to agar aapko hooks (useState, useEffect, useForm, etc.) use karna hai, to 'use client' likhna zaroori hai.

import { Button } from '@/components/ui/button';
// ✅ Custom Button component import kiya gaya hai (shadcn/ui ka button hoga) jo styling aur reusability ke liye use hota hai.

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
// ✅ Ye saare shadcn/ui ke form components hain jo react-hook-form ke sath integrate hote hain.
// - Form: pura form ka wrapper
// - FormField: ek input field ko manage karta hai
// - FormItem: ek field ka container (label + input + message)
// - FormLabel: input ka label
// - FormMessage: error ya helper message dikhata hai

import { Input } from '@/components/ui/input';
// ✅ Custom styled input field.

import { useToast } from '@/components/ui/use-toast';
// ✅ Toast hook import kiya gaya hai jo notification messages show karega (success/error ke liye).

import { ApiResponse } from '@/types/ApiResponse';
// ✅ TypeScript type define karta hai API response ka structure (success, message, etc.).

import { zodResolver } from '@hookform/resolvers/zod';
// ✅ Ye react-hook-form aur zod ko integrate karta hai -> taaki validation ke liye zod schema use kar sake.

import axios, { AxiosError } from 'axios';
// ✅ axios: API request karne ke liye
// ✅ AxiosError: agar request fail ho jaye to error ka type safe handling kar sake.

import { useParams, useRouter } from 'next/navigation';
// ✅ useParams: URL ke params nikalne ke liye (jaise /verify/[username])
// ✅ useRouter: navigation ke liye (redirect, replace, etc.)

import { useForm } from 'react-hook-form';
// ✅ react-hook-form ka hook jo form handle karta hai (validation, values, submit, etc.)

import * as z from 'zod';
// ✅ zod ek schema validation library hai, strongly typed validation ke liye.

import { verifySchema } from '@/schemas/verifySchema';
// ✅ Ye zod schema hai jo code ka format validate karega (e.g., numeric, required, length etc.).

// ---------------------- COMPONENT START ----------------------

//verfi Account function bana rahe hai and yahi pe hum iss function ko export bhi kr rahe h
export default function VerifyAccount() {
    // sabse phele to mujhe 1 router chahiye , using useRouter se le lete h
    // router anne se mai,kabhi bhi kisi ko kahi bhi navigate krwa skta hu
  const router = useRouter(); 
  // ✅ navigation ke liye useRouter hook.


  // ab mujhe url se data lena h, to using useParams se ye bhi kr lenge.
  // useParams ye 1 hook h, ab { username: string } ye aap bol rahe ho, mujhe username hi chahiye and isska type string hi hoga.
  const params = useParams<{ username: string }>(); 
  // ✅ URL ke params se username nikal raha hai -> e.g., agar route /verify/john hai, to params.username = "john".

  // ab 1 toast bhi use krenge , to bs destruct kr lete hai useToast se
  const { toast } = useToast(); 
  // ✅ Toast hook -> success/error messages show karne ke liye.



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
  const form = useForm<z.infer<typeof verifySchema>>({
    // Ab useForm ke ander hum resolver add kr skte hai.
    // ye rahe mere resolver option, ab aape depend krta hai kaise resolver use krna cahhte h
    // Mereko yaha abhi, zodResolver use krna hai.
    // zodResolver() - appne aap me kaam nhi krta , issko chahiye ek schema (eg-signUpSchema)
    resolver: zodResolver(verifySchema),
  });

  

  // ab jab submit ho jaayega, tab kaise data lena h wo sb krte hai.
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
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {

    // ab chalte hai, try catch me 
    try {
      // sabse pehle to await krwate hai, then axios ka use krke ek post request krenge.
      // post - ka data type bhi define kr skte hi like - ApiResponse ki tarah hoga.
      // ab mera data jaayega '/api/verify-code', yaha meri request jaane waali h
      // and then mai ,data as it is passed kr deta hu.
      // and value hold kr deta hu, response ke ander.
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,  // URL se username maine extract kr liya
        code: data.code,            // form me user ne jo code dala hai wo maine extract kr liya
      });

      // ab mera response aa chuka h, and sabkuch thik hai to user ko ek toast "Success" waala show kr dete h
      toast({
        // toast ke ander hume kaafi option milte hai, like - title, descript use kr raha hu.
        title: 'Success',
        // description jo h mera, wo response ke ander data me ander message me rahega.
        description: response.data.message,
      });


      // toast message show hone ke baad mai, 
      //router ka use krke, mai redirect/replace  kar dunga user ko /sign-in waale page pe
      router.replace('/sign-in');
    } catch (error) {
      // ✅ Agar error aaya to AxiosError type ke sath handle karega
      const axiosError = error as AxiosError<ApiResponse>;


       // ab mera response aa chuka h, and sabkuch thik hai to user ko ek toast "Success" waala show kr dete h
       toast({
        // toast ke ander hume kaafi option milte hai, like - title, descript use kr raha hu.
        title: 'Verification Failed',
        // description jo h mera, ussme using chaining operator axiosError.response waala message show krunga,
        // and agar nhai yaaha to main data.message ?? me apna default message "  'An error occurred. Please try again." show kr dunga.
        description:  axiosError.response?.data.message ??
        'An error occurred. Please try again.',
        // agar aap chaho to varient le skte ho, like - default and destructive
        variant: 'destructive',
      });

    }
  };

  // ---------------------- JSX RETURN ----------------------
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* ✅ Ye outer div screen ke center me card place kar raha hai */}
      
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        {/* ✅ Ye card hai jisme form hai */}
        
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>


        {/* Main Part ---  */}
        {/* main part - same code from Topic - Build your form (docs - https://ui.shadcn.com/docs/components/form) */}
        {/* Form ko le aate hai, react-hook-form se */}
        {/* next humne documentation me dekha mujhe destructure krke ...form lena hoga to ye kr lete h */}
        {/* Uppar "const form" bana hua hai ussme hi saare Form ka data inject krte jaayenge.  */}
        <Form {...form}>
            {/* ab aate hai small form ke ander , isske ander hume onSubmit chahiye */}
          {/* onSubmit ye waala normal ni h, usske ander hume milta h form then handlesubmit method,
          handleSubmit method apne aap kuch nhi krta to,isske ander
          (onsubmit) call kr denge, jo humne banaya h*/}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
             {/* ab form field le aate hai document se and then modified kr denge */}
            {/* Summary : 
                  Form Field 
                    -> FormItem
                    ->Input 
                    ->Form Message (not using we are)*/}
            <FormField
              name="code"
              control={form.control}
              // render krna hai field ko , means saare control mujhe field ko dena h
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  {/* // ab field to humne yaha de diya, but isske ander value inject krna hoga. */}
                  <Input {...field} /> {/* ✅ Input bind hua react-hook-form se */}
                  <FormMessage /> {/* ✅ Error message agar validation fail hua */}
                </FormItem>
              )}
            />

            {/* ✅ Submit Button */}
            <Button type="submit">Verify</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
