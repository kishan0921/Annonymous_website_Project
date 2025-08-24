
// 01- Ab hum zod ka use krenge, to import kr lete h
import { z } from 'zod';



export const verifySchema = z.object({
  // verifySchema me 1 hi object check krna hai.
  // z ke ander method hai () and usske and object hai.
  // then check krenge, code ko using zod ka use krenge
  code: z
  // string hai ya nahi
  .string()
  // string hona and then length check krenge 6
  .length(6, 'Verification code must be 6 digits'),
});


