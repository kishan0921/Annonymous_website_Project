
// resend ka package install kiye hai , then import kr lenge
import { Resend } from 'resend';


// resend ke docuemntation se, ye connect krne waala line copy kiye hai.
// basically, resend 1 const variable bana rahe h, then 
// using new keywrod use kr rahe h, then Resend() method ka use kr rahe h, then process.env.RESEND_API_KEY ka value passs kr rahe
// sab kuch thik to export kr rahe h.
export const resend = new Resend(process.env.RESEND_API_KEY);
