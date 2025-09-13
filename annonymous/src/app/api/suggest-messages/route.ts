// Open ai ka use hoga, so import kr liye
import OpenAI from 'openai';

// StreamingTextResponse - jab aap chatgpt se baat krte hai,to pura response banane me kaafi,
// time laagta hai,to using StreamingTextResponse , ye karega, jaise jaise response generate hoga
// hum ussko stream krte jaayenge using OpenAIStream. (both imported OpenAIStream,StreamingTextResponse)
import { OpenAIStream, StreamingTextResponse } from 'ai';
//NextAuthOptions  import kr lete hai from next-auth se
import { NextResponse } from 'next/server';


// yaha hum open.ai se hum bhi file le aaye with api key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


// next js me ai ka intregation, tough hai.
// set the runtime to edge for best performance
export const runtime = 'edge';


// ab hum ek post request ka function banayenge,
// and request ka type define kr dete hai, Request
// and await ka use hua hoga, so async function bana lete h issko.
export async function POST(req: Request) {
    try {
        // starting me hum kuch default message denge, issliye prompt likh lete hai usska
        // to jab ai run hoga to prompt run hoga, then user ko response show hoga
        // and user ussme se option select kr lega.
        const prompt =
            "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

        // ask openai for a streaming completion given the prompt 
        // so mai specific mode : gpt-3.5 waala use kr raha hu.
        // and offcourse time lagega response generate hone me. so await use kr liye.
        const response = await openai.completions.create({
            // open ai ke ander , completions use kiya hu then, create method use kiya hu.

            //kaafi saare option milte hai , create () method ke ander like - model,max_tokens,stream,prompt

            // chatgpt ka model maine assigned kr diya hu.
            model: 'gpt-3.5-turbo-instruct',
            // max max_tokens set kr diya hu.
            max_tokens: 400,
            // jab prompt jaayega, and response generate hoga, show hona chahiye 
            // jaise jaise prompt ka response generate hota h, so stream true h
            stream: true,
            // then maine uppar waala prompt pass kr diya hu.
            prompt,
        });

        // jo bhi response aayega wo hum stream me pass kr rahe h.
        // convert the response into a friendly text-stream
        const stream = OpenAIStream(response);
        // Respond with the stream.
        return new StreamingTextResponse(stream);
    }
    // agar error aata hai, to catch mere handle kr lega
    catch (error) {
        // yaha hum, 1st - error ka type check krenge.
        // agar mera open ai ka error hai , apierror ka to hum issme se detal nikal skte hai.
        if (error instanceof OpenAI.APIError) {
            // OpenAI API error handling
            // error me se hum -(name,status,headers,message nikal liye hai)
            const { name, status, headers, message } = error;
            // then wo specific error details from error, se hum ek NextResponse 
            // ke ander json me saare error send kr diya hu.
            // and jo bhi status aaya h usska bhi status send kr diye h.
            return NextResponse.json({ name, status, headers, message }, { status });
        } else {
            // General error handling show kar denge, ki ai connect nhi ho paa raha h
            // then error print bhi krwa lete hai (,error) krke
            console.error('An unexpected error occurred:', error);
            // then error ko throw bhi kr dete h
            throw error;
        }
    }
}
