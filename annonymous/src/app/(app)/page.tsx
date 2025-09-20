'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// carousel message ko autoplay krna h to import kr lete h
import Autoplay from 'embla-carousel-autoplay';
// ab mujhe saare message chahiye.,, hard coded file se le liya.
import messages from '@/messages.json';

//doc se copy paste kr lenge - https://ui.shadcn.com/docs/components/carousel
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
      {/* Main content - thoda bahut css and text hai*/}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>

        {/* Carousel for Messages */}
        <Carousel
        // carousel ke ander as plugins hum autoplay feature ko use kr lenge 
        // Autoplay ke ander hume, kitne delay pe work krna h wo bs batana pdta hai.
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {/* carousel content me aao and {} laaga kr basic js start kr do  */}
            {
            // message pe map laga dete hai then mujhe key and value dena hoga,
            // map ke ander mujhe ek callback mil jaata hai,
            // like map( () => {}) - note yaha {} agar use kiye to return likhna hoga , so avoid this return 
            // hum normal () ye use krenge.
            // ab map ke ander mujhe 1st message milta h, then usske saath index.
            messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card>
                  {/* // ye raha CardHeader  */}
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>

      {/* and ye raha mera Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2023 True Feedback. All rights reserved.
      </footer>
    </>
  );
}
