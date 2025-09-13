// ye file kuch nahi hai, jitni bhi shdcn waali 
// css file hai ussko ek saath merge kr deta h.

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
