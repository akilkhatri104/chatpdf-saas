import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function convertToASCII(inputString : string){
  return inputString.replace(/[^\x00-\x7F]+/g,'')
}

export function handleError(error : unknown){
  if(error instanceof Error)
    return {error: error.message}
  else
    return {error: "An error occurred!"}
}