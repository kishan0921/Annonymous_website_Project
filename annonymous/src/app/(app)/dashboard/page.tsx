
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
      //'/api/get-messages' yaha pe and response jo aayega wo , and typescript follow kr rahe h ApiResponse ki tarah hoga.
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
          // description jo h mera axiosError.response ye waala show krega and agar ye present nhi h
        // to hum hard coded message fill kr rahe hai data.message ?? 'Failed to fetch message settings'
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




  // ab ek aur handleSwitchChange method banayega and ye async method hoga 
  const handleSwitchChange = async () => {
    try {
        // sabse pehle to await then axios ko bolo aapko ek request send krni h get 
      // '/api/accept-messages' yaha pe and response jo aayega wo , and typescript follow kr rahe h ApiResponse ki tarah hoga.
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        // request to fired kar denge, but kuch data bhi to send krna hoga na.
        // to hum bhej rahe hai , agar acceptMessages true/false hai to false/true kr do.
        acceptMessages: !acceptMessages,
      });

      // ab hum setValue waala hook, le kar aaye h to jo bhi response me mujhe mil raha h value wo set kr dete h.
      setValue('acceptMessages', !acceptMessages);

      // value set ho ga , then ek toast show kr dete hai.
      toast({
        // title me message show ho jaayga , jo ki reposne.data.message se aayega.
        title: response.data.message,
        //and variant de dete hai isska.
        variant: 'default',
      });
    } 
    // agar kuch garbar hota hai, to catch part handle kr lega.
    catch (error) {
      // ab axios ke error bhi catch kr lete hai.and error ka typescript deta bhi define kr dete hai , like ApiResponse jaisa hoga.
      const axiosError = error as AxiosError<ApiResponse>;
      // ab ek toast message bhi show kr den
      toast({
        title: 'Error',
        // description jo h mera axiosError.response ye waala show krega and agar ye present nhi h
        // to hum hard coded message fill kr rahe hai data.message ?? 'Failed to fetch message settings'
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  // ek ye condition mujhe check and return krni hogi,
  // agar mere pass session ni h, ya fir session ke ander user ni h
  // to hum directly empty div return kr denge. ya kuch message ke saath bhi return kr skte ho like
  // - Please login
  if (!session || !session.user) {
    return <div></div>;
  }

  // ab hum username nikal lete hai session ke user se 
  // session.user ko caste kr deta hu as User se warna error show krega.
  const { username } = session.user as User;


  // ab 2 chize hai, actually me hume ek baseUrl find krna hoga.
  // 2nd mujhe ek url build krna hoga.


  // window object mai use kr lunga, then isse mai location nikal skta hu, then location se protocol aa jaayega  (mtlb http , https ye sab)
  // then // laagayenge, 
  // then ek aur variable inject krte hai , host chaiye mujhe usske liye
  // to window object se location mil jaayega then locaiton se host mil jaayega.
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  // uppar ittna krne se profile url ni aaya hai, to chalo build kr lete h
  // profileUrl banane ke liye baseUrl lo then /u / username bas.
  const profileUrl = `${baseUrl}/u/${username}`;


  // lastly, hum ek method banana bhul gye copyToClipboard.
  const copyToClipboard = () => {
    // navigator ka option hai aapke bass , kyuki aap frontend pe ho and client components pe ho.
    // navigator ka help le kar , clipboard use kr lenge,then clipboard ke ander bahut method ka access milega, 
    // hum writeText use kr lenge and ussme (profileUrl) pass kr denge. taaaki copy pe click kro to profileUrl copy ho jaaye.
    navigator.clipboard.writeText(profileUrl);
    // ab agar profileUrl copy ho gaya h, then ek toast bhi show kr dete h.
    toast({
      // title me ye show hoga
      title: 'URL Copied!',
      // and description me ye show ho jaayega.
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

          {/* main kaam mera button ka hai  */}
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">

         {/* ye hai mera sabbse mai kaam  */}
        <Switch

// {...field} use kr rahe the and  and kon sa field hai usska name bhi define kr rahe the<FormField  name="username" bhi de rahe the, 
// but yaaha switch me name nhi hota hai, to hum ...register destructure kr liye, 
// jo ki apne aap me object hai, and usske ander value add kr du 'acceptMessages'
// and issi acceptMessages ko hum sab jagah ghuma rahe the.
          {...register('acceptMessages')}
          // niche ye sab state se check ho raha h.to koi problm ni
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          {/* accept message ka value hum accpetmessage pe depend krega and usske a/c ON ya OFF show hoga  */}
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
