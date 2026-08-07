import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Join class names, letting later ones win over earlier conflicting utilities.
 *
 * This is what makes every UI primitive overridable: a component picks its
 * variant classes first, then merges the caller's `className` last, so
 * `<Button className="bg-support" />` actually beats the variant's `bg-brand`
 * instead of producing two competing background utilities.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
