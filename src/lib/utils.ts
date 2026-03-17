import { type ClassValue,clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Extracts the numeric ID from a SWAPI URL like https://swapi.dev/api/people/1/ */
export function extractSwapiId(url: string): number {
  const match = /\/(\d+)\/$/.exec(url);
  return match ? parseInt(match[1], 10) : 0;
}

/** Returns "—" for SWAPI "unknown", "n/a", or "none" values */
export function fmt(value: string): string {
  if (!value || value === "unknown" || value === "n/a" || value === "none") {
    return "—";
  }
  return value;
}

/** Converts episode number to Roman numerals */
export function toRoman(n: number): string {
  const map: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  let remaining = n;
  for (const [value, numeral] of map) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }
  return result;
}
