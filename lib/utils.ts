import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const extractKeyFromUrl = (url: string): string => {
  const match = url.match(/f\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : ""; // Extracts the key from the URL
};