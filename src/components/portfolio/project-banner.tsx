"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./project-banner.module.scss";

interface ProjectBannerSlide {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface ProjectBannerProps {
  title: string;
  slides: readonly ProjectBannerSlide[];
}

export function ProjectBanner({ title, slides }: ProjectBannerProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || hovered || focused || reducedMotion || slides.length < 2)
      return;
    const timer = window.setInterval(() => {
      setActive((previous) => (previous + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused, hovered, focused, reducedMotion, slides.length]);

  function move(direction: number) {
    setActive(
      (previous) => (previous + direction + slides.length) % slides.length,
    );
  }

  return (
    <section
      className={styles.banner}
      aria-label={`${title} screenshot slideshow`}
      aria-roledescription="carousel"
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        move(event.key === "ArrowRight" ? 1 : -1);
      }}
    >
      <div className={styles.viewport}>
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={styles.slide}
            data-active={index === active}
            aria-hidden={index !== active}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              width={slide.width}
              height={slide.height}
              sizes="90vw"
              preload={index === 0}
              loading={index === 0 ? undefined : "eager"}
              className={styles.image}
            />
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="Previous screenshot"
        >
          <ArrowLeft size={20} />
        </button>
        <div className={styles.dots} aria-label="Choose screenshot">
          {slides.map((slide, index) => (
            <button
              type="button"
              key={slide.src}
              aria-label={`Show screenshot ${index + 1}`}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
            >
              <span />
            </button>
          ))}
        </div>
        <span className={styles.count}>
          {active + 1} / {slides.length}
        </span>
        {!reducedMotion ? (
          <button
            type="button"
            onClick={() => setPaused((previous) => !previous)}
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          >
            {paused ? <Play size={18} /> : <Pause size={18} />}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Next screenshot"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}
