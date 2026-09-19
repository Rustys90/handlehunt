import type { Config } from "tailwindcss";
const config: Config = { content: ["./src/**/*.{js,ts,jsx,tsx}"], theme: { extend: { screens: { xl: "1100px" } } }, plugins: [] };
export default config;
