import mongoose from 'mongoose';
import { object } from 'zod';


// ab yaha hum type script inject krenge.
// yaha hum ye jo connection hai database se jo krenge uska type define krenge
// ye connect object hai.
type ConnectionObject = {
    // and isska type number hai , and yaha pe optional banega,
    // means agar return hoti hai ye value to number hogi.
  isConnected?: number;
};


// ab hum connection name ka variable bana lete hai.
// and isska jo type hai wo, connection object hai , and initially empty object banega
const connection: ConnectionObject = {};



// Now, Important Database connect krenge.

// Database dusre continent me hota hai, and connect krne me time lgta hai.s
// and time lagega then hum function jo banayenge, ussko async banega.
// funciton name dbConnect() , now, jab database connect ho jaayega then return me kuch to milega hi 
// to uss return ka intezamm kr lenge, jo value return hogi wo ek promise hogi.
// and promise ke ander ky value aati hai , usse mujhe koi mtlb nahi to <void> diamong <> ka use krke value void kr diya.
// yaha void ka mtlb hai, jo bhi return data aayega usska usse mujhe koi farak nhi pdta
async function dbConnect(): Promise<void> {
 
 // TypeScript hai to , 1st step check kr lete hai , database is already connected to the database or not
  if (connection.isConnected) {
    // agar connected hai to console.log krke message print kr do.
    console.log('Already connected to the database');
    // and pura kaam ho gaya h to yahi return kr lete h.
    return;
  }



  // If not connected, then connect to the database
// to jab try krennge connect krne ka to kuch, error aayega to catch me lete h

// Now, database connect krenge
  try {
    // Attempt to connect to the database
    // and yaha pe mongoose.connect use krenge to connect to the database
    // and process.env.MONGODB_URI use krenge to connect to the database
    // and '' use krenge to connect to the database
    // {} - aur option bhi pass kr skte ho dusing connection, but hum nhi kr rahe h
    // and imp - database dusre continent me hota hai, and connect krne me time lgta hai. to await ka use kr lenge.
    // and jo bhi reposne aayega, usse db name ke const variable me store kr diya.
    const db = await mongoose.connect(process.env.MONGODB_URI || '', {});

    // ab db se hum connection lete hai and 1st index[0] pe jo value aata hai., wo hai readyState
    // uppar isConnected?. banaa hua h ussme number return hoga wohi raha kr rahe hai, agar db se connect hota hai to.
    connection.isConnected = db.connections[0].readyState;

    // and yaha pe console.log krke message print kr diya
    console.log('Database connected successfully');
  } catch (error) {
    // If connection fails, log the error
    console.error('Database connection failed:', error);
    
    // Graceful exit in case of a connection error
    process.exit(1);
  }
}


// Now, export kr lete hai, ye database connect krna waala pura process.
export default dbConnect;
