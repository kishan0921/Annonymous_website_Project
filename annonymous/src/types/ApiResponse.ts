// issme hum baan rahe hai, ki kis type se humara response show hona chahiye.

import { Message } from "@/model/User";


// Note : jab bhi types define ho rahe hote hai, most of the time hum, 
// interface hi use hota and hum interface ka name "ApiResponse" de rahe h  
// then export bhi rahe rahe hai, taaki issko import krenge. to use ho skke.
export interface ApiResponse {
    // ab response dikhega kaise, to mai chahta hi response me ek success ho and usska response boolen me ho.
  success: boolean;
  // response me ek message dikhega, and usska type string me ho
  message: string;
  // and response me isAcceptingMessages dikhega, and agar response aata hai to boolen me show hoga.
  // ye aa skta hai and nhi bhi aa skta hai, issliye optional hai ?:
  isAcceptingMessages?: boolean;
  // and response me messages dikhega, and agar response aata hai to array me show hoga
  // ayah jo Message pass hua hai, issko hum model/User.ts kiye hai ussko import kr lo.
  // agar databasse se message aayega , jo ki optional hai to usske liye ye bana liye h.
  messages?: Array<Message>
};
