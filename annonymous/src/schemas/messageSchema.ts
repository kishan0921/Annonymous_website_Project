import { z } from 'zod'


// ek message ka schema banega using zod , hum validation check krenge
// only particular for message ke time and message ke andar content property banega
// and using zod, validation check kr lenge.

// and ye export bhi kr rahe hai, taaki aur jagah use kr skke.
export const messageSchema = z.object({
  // z .(dot) object method ke ander ek object banega, 
  // and usme content property banega, and using zod, validation check kr lenge.
  content: z
  // string hai ya nahi
    .string()
    // string hona chahiye content, and atleast 10 character ka hona chahiye
    .min(10, { message: 'Content must be at least 10 characters.' })
    // and max 300 character ka hona chahiye
    .max(300, { message: 'Content must not be longer than 300 characters.' }),
});
