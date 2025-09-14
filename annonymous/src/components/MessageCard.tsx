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

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 
// 🔹 Shadcn UI card components import kiya.
// 🔹 Ye UI ke liye container provide karte hain, message ko nicely style karne ke liye.

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
type MessageCardProps = {
  message: Message; // ek single message object
  onMessageDelete: (messageId: string) => void; 
  // Parent component ko notify karne ke liye ki kaunsa message delete hua
};


// 🔹 Functional component start
export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast(); 
  // 🔹 toast ko initialize kiya
  // 🔹 Ye notification show karne ke liye use hoga

  // 🔹 Function for delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      // 🔹 Backend ko delete request bhej rahe hain
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );

      // 🔹 Agar delete successful hua, toast show karo
      toast({
        title: response.data.message,
        // 🔹 response.data.message backend se aayega, jaise "Message deleted successfully"
      });

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
