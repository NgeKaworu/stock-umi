export const mainHost = () => {
  switch (process.env.NODE_ENV) {
    case "production":
      return "https://api.furan.xyz/stock";
    default:
      return "http://localhost:9000";
  }
};
