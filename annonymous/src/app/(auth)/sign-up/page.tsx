
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
import { useDebounce } from 'usehooks-ts';


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
  const debouncedUsername = useDebounce(username, 300);

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
      if (debouncedUsername) {
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
            `/api/check-username-unique?username=${debouncedUsername}`
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
  [debouncedUsername]);


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
        // Kai tarah ke toea
        title: 'Success',
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);

      setIsSubmitting(false);
    } catch (error) {
      console.error('Error during sign-up:', error);

      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      let errorMessage = axiosError.response?.data.message;
      ('There was a problem with your sign-up. Please try again.');

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
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
            <Button type="submit" className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
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

