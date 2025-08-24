import { z } from 'zod'


// ek AcceptMessageSchema ka schema banega using zod , hum validation check krenge
// only particular for AcceptMessageSchema ke time, and 1 hi property h acceptMessages
// and isska type boolean hona chahiye like - true or false. bas

export const AcceptMessageSchema = z.object({
  // z .(dot) object method ke ander ek object banega, 
  // and usme acceptMessages property banega, and using zod, validation check kr lenge.

  // Jab user accept kr raha hai, message to bs 1 hi property hum check kr rahe h
  // using zod , hum acceptMessages ka validation check kr rahe h, ki ye boolean hai, ya nahi
  acceptMessages: z.boolean(),
});