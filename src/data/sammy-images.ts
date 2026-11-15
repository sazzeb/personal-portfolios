import { sammy } from "@/config/sammy";

export const sammyImages = {
  hero: {
    path: "transparent/01_formal_suit_background_transparent.png",
    width: 1024,
    height: 1536,
    alt: `${sammy.name} in a formal suit with his arms folded`,
  },
  services: {
    path: "transparent/02_Studio_Holding_MacBook_Pro_2025_transparent.png",
    width: 1024,
    height: 1536,
    alt: `${sammy.name} holding a MacBook Pro`,
  },
  experience: {
    path: "sam/05_Executive_Standing_MacBook_Pro_2025.png",
    width: 1448,
    height: 1086,
    alt: `${sammy.name} standing beside his desk and MacBook Pro in an office`,
  },
  serviceDetails: {
    path: "sam/01_Office_Meeting_MacBook_Pro_2025.png",
    width: 1536,
    height: 1024,
    alt: `${sammy.name} discussing a project during an office meeting`,
  },
} as const;
