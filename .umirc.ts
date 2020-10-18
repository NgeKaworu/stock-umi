import { defineConfig } from "umi";
import theme from "./src/theme/";

export default defineConfig({
  nodeModulesTransform: {
    type: "none",
  },
  routes: [
    {
      path: "/",
      routes: [
        { path: "/", component: "index" },
        // { path: "/statistic/", component: "statistic" },
        { redirect: "/" },
      ],
    },
  ],
  theme,
  hash: true,
  title: "股票加权计算器",
  base: "/stock",
  publicPath: "/stock/",
  runtimePublicPath: true,
  dynamicImport: {
    loading: "@/Loading",
  },
  favicon: "./assets/favicon.ico",
});
