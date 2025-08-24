
// Introduction of Zod package ?
// Mongoose ke through jab aap schema likhte ho to wo , database ke liye hota hai
// lakin yaha jo hum schema likh rahe hai , wo kisi aur purpose ke liye hota hai
// Like - signUpSchema (Only singUp ke time mujhe validation check krna hai to hum zod ka use krenge.)
// Zod= typeScript first schema validation hai.
// Like - agar aapko singUp check krna hai to mai mongoose tk  jaane se pehle hi validation kr dunga.



// Zod ko import krte hai
import { z } from 'zod';


// 01- Ab sabse pehle hum validation check krenge and export bhi kr denge, isse taaki kahi aur bhi use kr paaye.
// Syntax : aisa hoga 
// export krnege like ek const variable usernameValidation name ka 
// then z ko invoked krenge, then z
// .string() use krenge to check ye string hai ky, 
// then min username letter 2 hona chahiye, 
// then max username letter 20 hona chahiye, 
// regex use krenge, taaki special character nhi honge - special character nhi hone chahiye
export const usernameValidation = z
  .string()
  .min(2, 'Username must be at least 2 characters')
  .max(20, 'Username must be no more than 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');



// 02- Ab hum signUpSchema bana lete hai
// then zod ka use krenge , then zod ka object bana lete hai
// and then sabkuch hum variable me store kr rahe hai , name - "signUpSchema"
export const signUpSchema = z.object({
  // 01- Ab hum usernameValidation ka use krenge, and username check kr lenge.
  username: usernameValidation,

  // 02- aa jao email check krna hai, to hum zod ka use krenge
  email: z
  // string hai ya nahi check kr lete hai.
  .string()
  // string hona chahiye email, then yaha hum check kr rahe h email, bhi hona chahiye.
  .email({ message: 'Invalid email address' }),

  //03 - Ab password check krna hai, to hum zod ka use krenge
  password: z
  // string hai ya nahi check kr lete hai
    .string()
    // string hona chahiye password, and atleast 6 character ka hona chahiye
    .min(6, { message: 'Password must be at least 6 characters' }),
});
 