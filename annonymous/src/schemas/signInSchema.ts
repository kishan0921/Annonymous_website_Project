import { z } from 'zod'


// ek singin ka schema banega using zod , hum validation check krenge
// only particular for singin ke time
export const signInSchema = z.object({

  // singin jab hoga to mujhe chahiye identifier and password
  // identifier ko aap username/email ki tarah smjho.
  // ye better word hai production me. issliye iss name ka use krte hai.
  // singin ke time aapko username/email/identifier check kr rahe hai, string me hona chahiye
  identifier: z.string(),

  // password jo hai aap bas singin ke time, string me de do ye validation kr rahe hai.
  password: z.string(),
});

 