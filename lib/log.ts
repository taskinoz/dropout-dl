export function error(message: string): void {
  console.error(message);
  process.exit(1);
}

export function log(message: string): void {
  console.log(message);
}