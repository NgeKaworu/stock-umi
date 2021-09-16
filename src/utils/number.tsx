export function safeAdd(a: any, b: any): number {
  return a ?? 0 + b ?? 0;
}

export function safeDivision(a: any, b: any): number {
  return a ?? 0 / b ?? 1;
}
