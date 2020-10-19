export function SafeNumber(i: any): number {
  const n = Number(i);
  return n || 0;
}
