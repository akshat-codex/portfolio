import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge class names, letting later Tailwind classes win (shadcn-style `cn`). */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
