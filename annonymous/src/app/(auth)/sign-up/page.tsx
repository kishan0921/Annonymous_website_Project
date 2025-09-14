
'use client';

// ye error ya request(get) ke datatype define hone me use hoga , so import kr lete h
import { ApiResponse } from '@/types/ApiResponse';
// zod resolver and useform to lagega hi laagega.
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
// Linkage bhi laagega hi laagega, to next se le laate hai.
import Link from 'next/link';

import { useEffect, useState } from 'react';
// import { useDebounce, useDebounceCallback } from 'usehooks-ts';
import {useDebounceCallback } from 'usehooks-ts';


import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// toast package install ho gya , now import kr liye
import { useToast } from '@/components/ui/use-toast';

// axios use hoga to import kr lete hai, request send hone ke liye used hoga.
// and agar aap chaho to AxiosError bhi milte h, ussko bhi le skte ho.
// incase axios related error h, ussko show krna hai to aap "AxiosError" ka use kr skte h
import axios, { AxiosError } from 'axios';
// ye Loader2 name ka icon hum, direct lucide-reader se import kr rahe h
// Note: lucide-reader (shadcn provide krta h)
import { Loader2 } from 'lucide-react';
// use router import kr lete h, kyuki user ko idhar udhar to bhejenge hi
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Earlier we are using,useDebounce . but ussko remove krke hum useDebounceCallback use krenge
  //  useDebounce ke ander username function ka value , 300 milisec me set ho jaayega
  const debounced = useDebounceCallback(setUsername, 300);

  // use router bhi use kr lete h, kyuki user ko idhar udhar to bhejenge hi
  const router = useRouter();

  // and yaha hum toast ko initiate kr diye
  // Note: () - parenthesis
  const { toast } = useToast();

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
  const form = useForm<z.infer<typeof signUpSchema>>({
    // Ab useForm ke ander hum resolver add kr skte hai.
    // ye rahe mere resolver option, ab aape depend krta hai kaise resolver use krna cahhte h
    // Mereko yaha abhi, zodResolver use krna hai.
    // zodResolver() - appne aap me kaam nhi krta , issko chahiye ek schema (eg-signUpSchema)
    resolver: zodResolver(signUpSchema),
    // ek aur step hota hai, like - form ki default state kaisi rahegi.
    // to yaha aapko 1 aur value milti h, default value ka
    defaultValues: {
        // aab ky ky control krna hai, wo aappe hai.
        // form ka default value me, username,email,password sab empty h
      username: '', // By default empty
      email: '', // By default empty
      password: '', // By default empty
    },
  });

  // ab aate hai, hum 1 hook pe - useEffect
  // deboouncing to hm use krenge hi, but usske baad ek request to jaani chahiye na , jo check kregi 
  // ki username avaiable h ya nhi. (and simply hum checkUsernameUnique - ke ander Get request mera bana hua 
  // jo check kr lega, ki username unique h ya nahi.
  // Note: jab bhi mera page reload hoga, useeffect call hoga and 2nd jab mera username ki value change hogi. 
  // lakin username ki value nahi , debounce username ki value change hogi jab 2nd time mera useeffect run hoga.
  // Syntax - 
  // useEffect (() => {}, [] ) 
  // () => {}, - ek mera lgta hai callback 
  // [] - aur ek laagta hai mera dependency array.

  useEffect(() => {
    // ab mujhe username check krna hai.
    // to ek kaam krte hai yaha ek , method bana lete h "checkUsernameUnique"
    // offcourse async method hoga (kyuki database se baat krenge hum)
    const checkUsernameUnique = async () => {
        // ab iss method ko abhi tk call nhi kiye h, 
        // abhi 1st check krengege.
        // debouncedUsername me koi value hai ya nahi.
      if (username) {
        // setIsCheckingUsername - true mtlb abhi chl rahi h checking
        setIsCheckingUsername(true);
        // next mera jo setUsernameMessage - ussko empty kr deta hu
        setUsernameMessage(''); // Reset message

        // ab chalte h mere try catch ke ander,
        try {
            // ab mera aayega await and then axios use hoga and axios chalta hai ek get request krna
            // axios ko ek get reuqest bhejni h, kaha pe ? backticks me `` me bata do 
            // like -`/api/check-username-unique?username=${debouncedUsername}`
            // and jo value aayega ussko hold kr dete h - ek response name ke variable me
            // get - ka data type bhi define kr skte hi like - ApiResponse
          const response = await axios.get<ApiResponse>(
            // username ke ander hum variable inject kr diye h ${debouncedUsername}
            `/api/check-username-unique?username=${username}`
          );
          // ab mera message aa hi jaata hai , to sidha use kr lo setUsernameMessage.
          // Axios me , mere pass response ke ander data aata hai,then backend se jitna bhi data bheja , wo message ke ander extract krwa skte ho.
          setUsernameMessage(response.data.message);
        } 
        // agar chize karab ho rahi ho to catch handle kr lega.
        catch (error) {
            // yaha hum axios ke error handle krna learn krenge.

            // mera jo error hai ussko AxiosError ki tarah caste kr do.
            // AxiosError ka datatype define kr skte ho , like- ApiResponse 
            // then value hold kr lete hai axiosError variable me
          const axiosError = error as AxiosError<ApiResponse>;
          // agar karab ho gya h case to 
          // axiosError.response?  ho skte h isske ander aaya ho. (so optionally ?. use krenge) 
          // Method - 01
          // agar nahi aaya h, so , ?? (use krke hum data.message me apne hi message de dete hai - Error checking username)data.message ?? 
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        } 
        // ye to chalna hi chalna h
        // finally ka use krke , setIsCheckingUsername - false kr denge.
        // setIsCheckingUsername(false); ye mujhe catch ke last line me , and try ke last line me likha tha,
        // but using finally, 2 jagah ni likhna pada , direct finally me 1 jagah use kr liye.
        finally {
          setIsCheckingUsername(false);
        }
      }
    };

    // ab uppar "checkUsernameUnique" method banaya h , to run bhi kara dete h.
    // run krwa diya hu.
    checkUsernameUnique();
  }, // Dependecy array me mera debouncedUsername(for 2nd time run), 1st time run (when page called)
  [username]);


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
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    // jab submit pe click kroge to setIsSubmitting - ko activate kr dete h
    setIsSubmitting(true);

    // ab chalte hai, try catch me 
    try {
      // sabse pehle to await krwate hai, then axios ka use krke ek post request krenge.
      // post - ka data type bhi define kr skte hi like - ApiResponse ki tarah hoga.
      // ab mera data jaayega '/api/sign-up', yaha meri request jaane waali h
      // and then mai ,data as it is passed kr deta hu.
      // and value hold kr deta hu, response ke ander.
      const response = await axios.post<ApiResponse>('/api/sign-up', data);

      // ab mera response aa chuka h, and sabkuch thik hai to user ko ek toast "Success" waala show kr dete h
      toast({
        // toast ke ander hume kaafi option milte hai, like - title, descript use kr raha hu.
        title: 'Success',
        // description jo h mera, wo response ke ander data me ander message me rahega.
        description: response.data.message,
      });

      // toast message show hone ke baad mai, 
      //router ka use krke, mai redirect/replace  kar dunga user ko /verify/ and username ke name waale page pe
      
      router.replace(`/verify/${username}`);


    // finally use nahi kr rahe, so try ke last me , and catch ke last me 
    // setIsSubmitting(false); krna hoga.
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error during sign-up:', error);

      // yaha hum axios ke error handle krna learn krenge.

            // mera jo error hai ussko AxiosError ki tarah caste kr do.
            // AxiosError ka datatype define kr skte ho , like- ApiResponse 
            // then value hold kr lete hai axiosError variable me
            const axiosError = error as AxiosError<ApiResponse>;
            

      // Default error message
      // agar karab ho gya h case to 
      // axiosError.response?  ho skte h isske ander aaya ho. (so optionally ?. use krenge) 
      // Method - 02
      // agar nahi aaya h, so , data.message; (use krke hum data.message me apne hi message de dete hai - There was a problem with your sign-up. Please try again.) 
      let errorMessage = axiosError.response?.data.message;
      ('There was a problem with your sign-up. Please try again.');


            // ab mera response aa chuka h, and sabkuch thik hai to user ko ek toast "Success" waala show kr dete h
            toast({
              // toast ke ander hume kaafi option milte hai, like - title, descript use kr raha hu.
              title: 'Sign Up Failed',
              // description jo h mera, ussme errorMessage show kr diye.
              description: errorMessage,
              // agar aap chaho to varient le skte ho, like - default and destructive
              variant: 'destructive',
            });
     

      // finally use nahi kr rahe, so try ke last me , and catch ke last me 
    // setIsSubmitting(false); krna hoga.
      setIsSubmitting(false);
    }
  };
// Logical part complete ho gya h mera yaha pe


// ab mujhe frontend pe bhi deal/ handle krna hoga 
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

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
              name="username"
              control={form.control}
              // render krna hai field ko , means saare control mujhe field ko dena h
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                  // ab field to humne yaha de diya, but isske ander value inject krna hoga.
                    {...field}
                    // bahut easy hai, onChange name ka classic method hota hai.
                    // onchange ke ander humare pass event (e) aata hai, and ye event ke 
                    // through hum value add kr denge, Esliye
                    onChange={(e) => {
                      // ab boliye ek field hai and isske ander onChange h and then event pass kr rahe h, field ko
                      field.onChange(e);
                      // ab react hook form wala process yaha end ho raha, 
                      // but extra hum ye username field jo h,issko mai 1 aur jagah manage kr raha hu personally mere liye,
                      // kyuki maine ek functionally daali h, uppar mai username field ko control kr raha hu.
                      // So, setUsername(e.target.value); ye likhna pada mujhe
                      debounced(e.target.value);
                    }}
                  />
                  {/* thodi si javascript use kr lete h,jab username check ho raha h, uss time 
                  ek Loader2 ko show kr denge */}
                  {isCheckingUsername && <Loader2 className="animate-spin" />}


                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        // Username is unique exaclly ye message aayega to ? (green) : nahi to (red) me username show kr denge.
                        usernameMessage === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {/* // and yaha pe message show kr diye h */}
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
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
                  <Input type="password" {...field} name="password" />
                  <FormMessage />
                </FormItem>
              )}
            />


            {/*ab mera form khtm ho raha , so usse pehle 1 button show krna hoga  */}
            {/* button ke ander bhi kuch properties h like - button ka type, classname ,disbled kb hoga button */}
            {/* // button disabled/enabled hoga based on isSubmitting= true/false  */}
            <Button type="submit" className='w-full' disabled={isSubmitting}>

              {/* // chalo aao text ko manipulate krte hai, using javascript */}
              {/* //hume pta hai, humare pass isSubmitting hai 
              so  isSubmitting ? () true hai to kuch kr lenge 
              nahi to : () falase hai to kuch kr lenge  */}
              {isSubmitting ? (
                // agar true hai , to loader components load krwa dete h
                <>
                {/* Loader2 icon from shadcn se  */}
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {/* // and text show hoga, Please wait */}
                  Please wait
                </>
              ) : (
                // isSubmitting false hai to - 'signup'
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>

        {/* form ke and me  agar aap already member ho to sign in add kr diya hu*/}
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

