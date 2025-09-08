// Iss file me , mainly hum new data types define krenge.
// Define nahi, actually existing thing ko modified Krenge.
import "next-auth";

// Note: New concept
// Agar new data types redefine ya, modified krna ho to
// declare use krte hai.

// Method - 01-https://next-auth.js.org/getting-started/typescript#adapters
// open the link then - find Extend default interface properties
// New Trick to to redefine

// Lets start, mujhe modified krna hai, module ko kon sa? 'next-auth/jwt'
declare module "next-auth" {
  // Mera interface jo hai , wo h session
  // Session ka kuch field hoga ,but mai isse,fir se declare kr raha hu
  // HUm , ek aur interface redefine krenge.
  interface Session {
    // session ke ander "User" name ka object aayega.
    user: {
      // User ke ander id field le lete hai, and isska type string rakh rahe h
      _id?: string;
      // isVerified and ye optional hai, and isska type boolean
      isVerified?: boolean;
      // isAcceptingMessages and ye optional hai, and isska type boolean
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultSession["user"]; // and mujhe extra, chahiye DefaultSession , and ye bhi chahiye and isski key "User" hogi.
  }

  // Ab next-auth me zaada interface se to cher char nahi krunga.
  // mai bas User interface ko modified krunga.

  // Mera interface jo hai , wo h user
  // User ka kuch field hoga ,but mai isse , fir se declare kr raha hu
  // by adding new fields.
  interface User {
    // ye optional field hai , and type string hai
    _id?: string;
    // isVerified - ye bhi optional field hai, and type boolean
    isVerified?: boolean;
    // isAcceptingMessages - ye bhi optional field hai, and type boolean
    isAcceptingMessages?: boolean;
    // Username bhi optional hai and type string h.
    username?: string;
  }
}

// Method - 02-https://next-auth.js.org/getting-started/typescript#adapters
// open the link then - find Extend default interface properties
// New Trick to to redefine

// Decalre kr rahe hai , module and mujhe chahiye next-auth and mai modified krna chahta hua
// next-auth/jwt ko
declare module "next-auth/jwt" {
  // and mujhe interface JWT redefine krna hai.
  interface JWT {
    // now jwt ke ander field define kr rahe hai.
    // like : id jo hai wo optional hai, aayega to string me nhi to null show hoga
    _id?: string;
    // same isVerified ka value optional h, aagar aayega to boolean me else null sho hoga.
    isVerified?: boolean;
    // same isAcceptingMessages ka value optional h, aagar aayega to boolean me else null sho hoga.
    isAcceptingMessages?: boolean;
    // same username ke saath bhi chaining operator ka use hua h, aayega to string me else null
    username?: string;
  }
}
