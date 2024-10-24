import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValuelassValue[]): string {
  return twMerge(clsx(inputs))
}