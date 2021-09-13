export default <T extends unknown>(obj: T, ...path: Array<keyof T>) => {
  let cur: any = obj;
  for (const key of path) {
    cur = cur?.[key];
  }
  return cur;
};
