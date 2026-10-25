import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let counter = 0;
export function generateId(prefix: string = 'id'): string {
  counter += 1;
  const time = Date.now().toString(36);
  const rnd = Math.random().toString(36).substring(2, 7);
  return `${prefix}_${time}_${rnd}_${counter}`;
}
