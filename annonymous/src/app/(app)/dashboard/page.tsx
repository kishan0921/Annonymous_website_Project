
// ye to hoga hi hoga, kyuki kaafi hooks, react state wagera use krne waale hai.
'use client';


import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
S
function UserDashboard() {
  // 1st tension to mujhe h, message ki ... to message le aate hai.
  // [messages, setMessages] to saare messages mere pass aa jaayegnge, and use state use kr leta hu.
  // and starting me [] empty array rhega, and isska data type bhi define kr lete h, jo ki Message rahega, and ye model/user se aa jaayge .
  const [messages, setMessages] = useState<Message[]>([]);
  // ab state bhi manage krni padegi , to loading ki state to rahegi hi.initially ye false rahega.
  //  ye laoading use case ka hai, jab mai message fetch kr raha hu. and jab mai state change krunga uss case me SwitchLoading waala loader use kr lenge.
  const [isLoading, setIsLoading] = useState(false);
  //  ye laoading use case ka hai, jab mai message fetch kr raha hu. and jab mai state change krunga uss case me SwitchLoading waala loader use kr lenge.
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  // Toast  bhi use hoga, so le aate hai.S
  const { toast } = useToast();


  // ab hum yaha optimitize ui update krenge,
  // means - like jaise hum instagram pe like krte hai, ussi time ui update ho jaata hai.
  // actual me wo server se update ni hota hai, but hum ui pe update kr dete hai instantly and then agar backend 
  // se kuch problm hota hai to ussko ui pe update kr denge..aisa kuch yaaha pe bhi krenge.

  // hum ek method banayenge handleDeleteMessage , and ye jab bhi run krega to issko messageId: string chahiye hoga.

  const handleDeleteMessage = (messageId: string) => {
    // ab setMessages ke ander saare messages hai mere, 
    // then filter krwaao and filter ke ander callback ka use kro 
    // then callback ko bolo, aapke pass jo message aa raha h, 
    // message._id !== messageId , messageId equal to nhi to ussko bahar rahne do and rest ko add kr do.
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  // ab user ke dashboard pe hu, to session lagega hi lagega.
  // data: session  - pta nahi kyu aise liye h , but documentation me aise hi mention h.
  const { data: session } = useSession();


  // ab useForm method ka use kr liye h.
  const form = useForm({
    // ab ek zodResolverresolver use krenge, and ye mere aayega resolver se
    // ab zodResolver apne aap nhi kaam krega , issko method name pass krna hoga.
    resolver: zodResolver(AcceptMessageSchema),
  });



  // form se hum register, watch, setValue nikal lete hai.
  const { register, watch, setValue } = form;

  // kis chiz ko hume watch krna hai, wo inject krna hota h 
  // to watch me hum 'acceptMessages' ko watch krna chahte h
  // watch ek method hai.
  const acceptMessages = watch('acceptMessages');



  // ab wohi simple hum api call krne waale hai.to hum use kr lenge, useCallback
  // isske ander hume async use krna hai, then ek callback
  const fetchAcceptMessages = useCallback(async () => {
    // setIsSwitchLoading(true); ko true krte hai, ye ek loader hai.
    setIsSwitchLoading(true);
    try {
      // sabse pehle to await then axios ko bolo aapko ek request send krni h get 
      //'/api/accept-messages' yaha pe and response jo aayega wo , ApiResponse ki tarah hoga.
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      // and jo bhi response aayega usse basis pe mai setValue set kr dega acceptMessages ka value ui pe immediately.
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      // ab axios ke error bhi catch kr lete hai.
      const axiosError = error as AxiosError<ApiResponse>;

      // ab ek toast message bhi show kr den
      toast({
        // toast ka title error h
        title: 'Error',
        // description jo h mera axiosError.response ye waala show krega and agar ye present nhi h
        // to hum hard coded message fill kr rahe hai data.message ?? 'Failed to fetch message settings'
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
          // and variant ye de rahe h
        variant: 'destructive',
      });

    } 
    // then filter always execute hota hi h, to issme setIsSwitchLoading(false) loader off kr dete h
    finally {
      setIsSwitchLoading(false);
    }
  }, 
  // issko bhi kuch dependency array chahiye hota hai.
  // value me change hoga, ya toast message show hoga to iss api hit kr denge.
  [setValue, toast]);


    // ab wohi simple hum api call krne waale hai.to hum use kr lenge, useCallback
  // isske ander hume async use krna hai, then ek callback
  const fetchMessages = useCallback(
    // jo bhi iss method ko use krega, wo mujhe ek variable bhejega refresh: and isska type boolean hoga. 
    // and agar kuch nhi bhejta h to hum isska value false le lenge.
    async (refresh: boolean = false) => {
      // setIsLoading(true); ko true krte hai, ye ek loader hai.
      setIsLoading(true);
      // setIsSwitchLoading(true); ko true krte hai, ye ek loader hai.
      setIsSwitchLoading(false);
      try {
        // sabse pehle to await then axios ko bolo aapko ek request send krni h get 
      //'/api/get-messages' yaha pe and response jo aayega wo , ApiResponse ki tarah hoga.
        const response = await axios.get<ApiResponse>('/api/get-messages');
        // setMessages ka use krenge and message store kr denge jo ki mujhe response.data.message se mil jaayegnge
        // in case kuch nhi mila to empty set kr dete h
        setMessages(response.data.messages || []);

        // agar mera refresh yaha pe h, to toast message show kr denge
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } 
      // kuch error aayega to catch handle kr lega.
      catch (error) {
         // ab axios ke error bhi catch kr lete hai.
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } 
      // then filter always execute hota hi h, to issme setIsSwitchLoading(false),
      // setIsLoading(false) loader off kr dete h
      finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    // issko bhi kuch dependency array chahiye hota hai.
  // vasetIsLoading,setMessages  me change hoga, ya toast message show hoga to iss api hit kr denge.
    [setIsLoading, setMessages, toast]
  );


// ab most important kaam kr lete h, ek useEffect ka use kr lete h 
// syntax -   useEffect ( () => {} - callback and [] - dependency array) 
  // Fetch initial state from the server
  useEffect(() => {

    // agar koi session nhi h, 
    // ya session to hai but usske ander user ni h.... to hum directly return kr denge issko.
    // mtlb ye mthod hum run hi nhi krenge. iss case me
    if (!session || !session.user) return;


    // saare message mujhe fetch kr do
    fetchMessages();

    // and ye use kro isse mujhe state pta chl jaayegi.
    fetchAcceptMessages();
  }, 
  // agar session, setValue, toast, fetchAcceptMessages, fetchMessages kuch bhi change hota h to issko run kro.
  [session, setValue, toast, fetchAcceptMessages, fetchMessages]);




  // Handle switch change 
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
