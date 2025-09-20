'use client'
// 🔹 Ye Next.js ka special directive hai.
// 🔹 Normally Next.js me components server-side hote hain (server components).
// 🔹 Lekin hum yaha useState, toast, axios, aur client-side interactions use kar rahe hain.
// 🔹 Isliye "use client" likhna mandatory hai, taaki ye component browser me run ho.

import React, { useState } from 'react'; 
// 🔹 React import kiya aur useState hook le liya. 
// 🔹 useState state management ke liye use hota hai.

import axios, { AxiosError } from 'axios'; 
// 🔹 Axios import kiya HTTP requests bhejne ke liye.
// 🔹 AxiosError type import kiya, taaki error properly type-safe handle ho.

import dayjs from 'dayjs'; 
// 🔹 Dayjs ek lightweight library hai date formatting ke liye.
// 🔹 message ka createdAt ko readable format me dikhane ke liye use karenge.

import { X } from 'lucide-react'; 
// 🔹 Lucide-react icons ka X import kiya delete button ke liye.

import { Message } from '@/model/User'; 
// 🔹 Message type import kiya.
// 🔹 Ye define karta hai ki ek message object me kya kya fields honge (_id, content, createdAt, etc).

// npx shadcn@latest add card karke install kar liya hu and then
// document https://v3.shadcn.com/docs/components/card se import kr liya hu, saare cards
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 
// 🔹 Shadcn UI card components import kiya.
// 🔹 Ye UI ke liye container provide karte hain, message ko nicely style karne ke liye.


// Note: ALert ka use hoga jab, click kroge to wo alert show krega, yes or no issliye.
// npx shadcn@latest add alert-dialog - isse install kr liye 
// and https://v3.shadcn.com/docs/components/alert-dialog  me jaakar - import bhi kar liye
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'; 
// 🔹 AlertDialog components import kiye, jo ek confirmation modal show karte hain.
// 🔹 Ye tab use hoga jab user delete button click karega.

import { Button } from './ui/button'; 
// 🔹 Reusable button component import kiya.  

import { useToast } from '@/components/ui/use-toast'; 
// 🔹 Toast notification system import kiya.
// 🔹 Success ya error messages show karne ke liye use hoga.

import { ApiResponse } from '@/types/ApiResponse'; 
// 🔹 API response ka type define kiya.
// 🔹 Isse TypeScript samajh jayega ki backend se kya response aayega.


// 🔹 Props type define kiya component ke liye
// MessageCardProps waala ek type bana lete hai.
type MessageCardProps = {
  // mera message aayah usska type hum model/ se le lete hai. 
  message: Message; // ek single message object
  // and ek method bhi aayega humare pass me.
  // onMessageDelete ye method mera ky return krega, pta nhi so void assigned kr dete h.
  // isske ander mujhe messageId milegi, jo ki string type ki rahegi.
  onMessageDelete: (messageId: string) => void; 
  // Parent component ko notify karne ke liye ki kaunsa message delete hua
};


// 🔹 Functional component start
// note: sabse pehla kaam ye hai, ki jab bhi aap ye MessageCard use kroge,
// to kuch property ya data h, ussko mujhe pass On krna hoga.
// to mai message - pass kar raha hu, and ek method onMessageDelete pass kar raha hu.
// and ek type hai, wo type assigned kr diye hi (MessageCardProps) ki tarah rahega.
// basically, typescript h to dataType define krna padega. kr diye MessageCardProps isski tarah hoga.
export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  // ek toast le lete hai, and ye mera useToast se aa jaayega.
  const { toast } = useToast(); 
  // 🔹 toast ko initialize kiya
  // 🔹 Ye notification show karne ke liye use hoga

  // 🔹 Function for delete confirmation
  // Ab handleDeleteConfirm ye kaise kaam krega ?
  // message ki id aa hi gayi hai mera pass, to sidha api request kr do , 
  // message delete krne ki.
  const handleDeleteConfirm = async () => {
    try {
      // 🔹 Backend ko delete request bhej rahe hain
      // hum simple ek axios requestion mar denge.and axios se bol denge app ek delete request fired kr do
      // and <ApiResponse> response bhi le liye.
      // Note: /api/delete-message/  (ye api abhi tk exist ni krta , next video me code krenge.)
      const response = await axios.delete<ApiResponse>(
        // axios jo h, simple sa request fired krega `` is url pe with message id pass kr rahe h.
        `/api/delete-message/${message._id}`
      );

      // 🔹 Agar delete successful hua, toast show karo
      toast({
        title: response.data.message,
        // 🔹 response.data.message backend se aayega, jaise "Message deleted successfully"
      });

      // jo onMessageDelete iss method ke ander bhi (message._id) pass kr denge.
      // 🔹 Parent component ko notify karo ki message delete hua
      onMessageDelete(message._id);

    } catch (error) {
      // 🔹 Agar error aaye to handle karenge
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive', 
        // 🔹 destructive variant ka matlab red colored toast
      });
    } 
  };


  // 🔹 JSX return start
  return (
    <Card className="card-bordered">
      {/* 🔹 Card header me message content aur delete button */}
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{message.content}</CardTitle> 
          {/* 🔹 Yaha message ka actual content show hoga */}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              {/* 🔹 Delete button trigger, modal kholne ke liye */}
              <Button variant='destructive'>
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              {/* 🔹 Modal content */}
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                {/* 🔹 Cancel button */}
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>

                {/* 🔹 Continue button, click hone par handleDeleteConfirm call hoga */}
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* 🔹 Message ka creation date/time show karenge */}
        <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
          {/* 🔹 Example: "Sep 15, 2025 2:30 PM" */}
        </div>
      </CardHeader>

      {/* 🔹 Card content area (empty for now) */}
      <CardContent></CardContent>
    </Card>
  );
}
