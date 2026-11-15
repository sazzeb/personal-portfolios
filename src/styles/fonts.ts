import localFont from "next/font/local";

export const headingFont = localFont({
  src: [
    { path: "./fonts/rajdhani-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/rajdhani-500.ttf", weight: "500", style: "normal" },
    { path: "./fonts/rajdhani-600.ttf", weight: "600", style: "normal" },
    { path: "./fonts/rajdhani-700.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-heading",
  display: "swap",
});

export const bodyFont = localFont({
  src: [
    { path: "./fonts/rubik-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/rubik-500.ttf", weight: "500", style: "normal" },
    { path: "./fonts/rubik-600.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});
