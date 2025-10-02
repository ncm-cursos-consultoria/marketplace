// src/styles/fonts.ts
import { Inter, Poppins } from "next/font/google";
// import localFont from "next/font/local"; // se usar fonte local

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const poppins = Poppins({ subsets: ["latin"], weight: ["400","600"], variable: "--font-poppins", display: "swap" });
// export const myLocal = localFont({ src: "../fonts/My.woff2", variable: "--font-my" });

export const fontVars = `${inter.variable} ${poppins.variable}`; // + myLocal.variable se tiver
