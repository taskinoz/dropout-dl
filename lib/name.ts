/**
 * Formats a name by removing the hyphens and capitalizing the first letter of each word.
 * @param name The name to format.
 * @returns The formatted name.
 * @example
 * formatName("cash-n-guns"); // "Cash N Guns"
 */
export function formatName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/-+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
