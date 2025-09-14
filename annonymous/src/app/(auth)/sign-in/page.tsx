'use client'; 
// 🔹 Next.js me default components "server components" hote hain (jo server pe run hote hain).
// 🔹 Lekin is form me hum use kar rahe hain: useState, useEffect, react-hook-form, etc. 
// 🔹 Ye sab sirf client-side (browser) pe kaam karte hain.
// 👉 Isliye file ke top pe "use client" likhna mandatory hai.


// -------------------- IMPORTS --------------------
import { ApiResponse } from '@/types/ApiResponse'; 
// 🔹 Ye ek custom TypeScript type hai jo define karta hai backend se aane wale response ka format.
// Example: { success: true, message: "User created" }

import { zodResolver } from '@hookform/resolvers/zod';
// 🔹 react-hook-form ke saath zod ko integrate karta hai.
// Zod = schema validation library (input sahi hai ya nahi check karta hai).

import * as z from 'zod';
// 🔹 Zod ka pura package import kiya (validation schema banane ke liye).

import { useForm } from 'react-hook-form';
// 🔹 react-hook-form ka main hook. Form ke inputs, validation aur submit handle karta hai.

import Link from 'next/link';
// 🔹 Next.js ka built-in component jo SPA navigation deta hai (page reload ke bina redirect).

import { useEffect, useState } from 'react';
// 🔹 React ke basic hooks import kiye: useState (state store karne ke liye), useEffect (side effects ke liye).

import { useDebounceCallback } from 'usehooks-ts';
// 🔹 Debounce ka hook. Ye help karta hai ki har key press pe API call na ho.
// 👉 Instead, kuch ms wait karega, fir API hit karega. (Performance ke liye best).

import { Button } from '@/components/ui/button';
import {
  Form, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// 🔹 Ye sab UI components hai jo humne Shadcn UI library se liye hain.
// Form + Input ke liye ek structured design milta hai.

import { useToast } from '@/components/ui/use-toast';
// 🔹 Toast notifications ke liye (success / error message dikhane ke liye).

import axios, { AxiosError } from 'axios';
// 🔹 Axios ek HTTP client hai jo frontend se backend ke API ko request bhejne ke kaam aata hai.

import { Loader2 } from 'lucide-react';
// 🔹 Loader spinner icon jo form submit hone par "loading..." dikhata hai.

import { useRouter } from 'next/navigation';
// 🔹 Next.js ka hook jo programmatically redirect karne me help karta hai.

import { signUpSchema } from '@/schemas/signUpSchema';
// 🔹 Ye Zod schema hai jo define karta hai ki form ka data kaisa hona chahiye.
// Example: password >= 6 characters, email valid hona chahiye, etc.


// -------------------- COMPONENT START --------------------
export default function SignUpForm() {

  // -------------------- STATE VARIABLES --------------------
  // Ye variables UI aur form ke behaviour control karte hain
  const [username, setUsername] = useState('');
  // 🔹 User jo username input me type karega, wo yaha store hoga.

  const [usernameMessage, setUsernameMessage] = useState('');
  // 🔹 Username available hai ya already taken hai, ye message yaha store hoga.

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  // 🔹 Jab tak username check ho raha hai, loader (spinner) dikhane ke liye.

  const [isSubmitting, setIsSubmitting] = useState(false);
  // 🔹 Jab form submit ho raha ho (sign up request backend pe gayi ho) tab button disable + loader on karne ke liye.


  // -------------------- DEBOUNCE --------------------
  const debounced = useDebounceCallback(setUsername, 300);
  // 🔹 Agar user continuously typing kar raha hai "kishan123"
  // to har key pe API call na ho. (k → ki → kis → …)
  // 🔹 Instead, 300ms rukega aur fir username ko set karega.


  // -------------------- HOOKS --------------------
  const router = useRouter(); 
  // 🔹 Signup success hone ke baad user ko "/verify/username" page pe bhejne ke liye.

  const { toast } = useToast();
  // 🔹 Toast notifications dikhane ke liye (success ya error messages).



  // -------------------- FORM SETUP --------------------
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    // 🔹 react-hook-form ke liye zod ko validator banaya.
    // Input me agar koi galat value hogi, to turant error dikhayega.

    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });



  // -------------------- CHECK USERNAME UNIQUE --------------------
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true); 
        setUsernameMessage('');

        try {
          // 🔹 Backend API ko GET request bhej rahe hain username check karne ke liye.
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${username}`
          );

          // 🔹 Agar API ne bola "unique hai", to green message show karenge.
          setUsernameMessage(response.data.message);

        } catch (error) {
          // 🔹 Agar error aaya (network error / username taken), to red message show karenge.
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsernameUnique();
  }, [username]); 
  // 🔹 Ye effect tabhi chalega jab `username` change hoga.



  // -------------------- HANDLE SUBMIT --------------------
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true); // Loader ON

    try {
      // 🔹 Backend pe POST request bhejna with form data
      const response = await axios.post<ApiResponse>('/api/sign-up', data);

      // 🔹 Success hone par green toast dikhayenge
      toast({
        title: 'Success',
        description: response.data.message,
      });

      // 🔹 User ko verify page pe redirect kar denge
      router.replace(`/verify/${username}`);

    } catch (error) {
      console.error('Error during sign-up:', error);

      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data.message ??
        'There was a problem with your sign-up. Please try again.';

      // 🔹 Agar koi error aaya (e.g., email already taken), red toast dikhayenge
      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });

    } finally {
      setIsSubmitting(false); // Loader OFF
    }
  };



  // -------------------- JSX (UI PART) --------------------
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        
        {/* FORM HEADER */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        {/* REACT HOOK FORM */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* USERNAME FIELD */}
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
                      debounced(e.target.value); // Debounced username check
                    }}
                  />
                  {/* Loader jab username check ho raha ho */}
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {/* Green ya red message dikhana */}
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

            {/* EMAIL FIELD */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <p className="text-muted text-gray-400 text-sm">
                    We will send you a verification code
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PASSWORD FIELD */}
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

            {/* SUBMIT BUTTON */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
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

        {/* FOOTER LINK */}
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
