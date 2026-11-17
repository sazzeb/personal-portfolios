import type { Metadata } from "next";
import type { ReactNode } from "react";
import { sammy } from "@/config/sammy";
import { headingFont, bodyFont } from "@/styles/fonts";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingTools } from "@/components/layout/floating-tools";
import { AnimationController } from "@/components/motion/animation-controller";
import "./globals.css";
import "@/styles/animations.scss";
import "swiper/css";

export const metadata: Metadata = {
  title: {
    default: `${sammy.name} — Personal Portfolio`,
    template: `%s | ${sammy.name}`,
  },
  description:
    `${sammy.name}’s creative portfolio. Discover design, development, ` +
    "selected projects, and professional experience.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${headingFont.variable} ${bodyFont.variable}`}
    >
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <FloatingTools />
        <AnimationController />
      </body>
    </html>
  );
}
