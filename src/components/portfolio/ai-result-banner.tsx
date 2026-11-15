"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { AiProjectImage } from "@/data/ai-case-studies";
import styles from "./ai-result-banner.module.scss";

interface AiResultBannerProps {
  title: string;
  images: readonly AiProjectImage[];
}

export function AiResultBanner({ title, images }: AiResultBannerProps) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const interacting = hovered || focused;
  const [visible, setVisible] = useState(true);
  const reducedMotion = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const image = images[active];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || interacting || reducedMotion || !visible || images.length < 2)
      return;
    const timer = window.setTimeout(() => {
      setDirection(1);
      setActive((previous) => (previous + 1) % images.length);
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [active, paused, interacting, reducedMotion, visible, images.length]);

  function select(next: number) {
    setDirection(next >= active ? 1 : -1);
    setActive((next + images.length) % images.length);
  }

  return (
    <section
      ref={root}
      className={styles.banner}
      aria-label={`${title} result gallery`}
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          select(active + (event.key === "ArrowRight" ? 1 : -1));
        }
      }}
    >
      <div className={styles.topline}>
        <span>Project evidence / Visual exploration</span>
        <span>
          {String(active + 1).padStart(2, "0")} /{" "}
          {String(images.length).padStart(2, "0")}
        </span>
      </div>
      <div className={styles.stage}>
        <div className={styles.orbit} aria-hidden="true" />
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.figure
            key={image.file}
            custom={direction}
            className={styles.frame}
            variants={{
              enter: (value: number) => ({
                opacity: 0,
                x: reducedMotion ? 0 : value * 65,
                scale: reducedMotion ? 1 : 0.95,
                rotateY: reducedMotion ? 0 : value * 8,
              }),
              center: { opacity: 1, x: 0, scale: 1, rotateY: 0 },
              exit: (value: number) => ({
                opacity: 0,
                x: reducedMotion ? 0 : value * -45,
                scale: reducedMotion ? 1 : 1.025,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: reducedMotion ? 0 : 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <a
              href={`/images/project/ai-results/${image.file}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={`/images/project/ai-results/${image.file}`}
                alt={image.caption}
                width={image.width}
                height={image.height}
                sizes="(max-width: 767px) 90vw, 80vw"
                unoptimized
                loading="eager"
              />
              <span className="sr-only">
                Open full-size image (opens in a new tab)
              </span>
            </a>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className={styles.caption}>
        <div className={styles.controls}>
          <button
            aria-label="Previous result"
            onClick={() => select(active - 1)}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            aria-label={paused ? "Play result gallery" : "Pause result gallery"}
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play size={18} /> : <Pause size={18} />}
          </button>
          <button aria-label="Next result" onClick={() => select(active + 1)}>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
