export const dva = {
  config: {
    onError(err: ErrorEvent) {
      // 继续传播
      // err.preventDefault();
      console.error("in dva", err.message);
    },
  },
};
