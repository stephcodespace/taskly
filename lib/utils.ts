import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Menggabungkan nama-nama class CSS secara kondisional
 * dan menyelaraskan class Tailwind yang bertabrakan.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
