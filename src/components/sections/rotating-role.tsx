"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { sammy } from "@/config/sammy";
import styles from "./hero.module.scss";

export function RotatingRole() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const wordRef = useRef<HTMLSpanElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const word = wordRef.current;
    if (!word) return;
    const updateWidth = () => {
      wrapperRef.current?.style.setProperty(
        "--role-width",
        `${word.offsetWidth + 10}px`,
      );
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(word);
    return () => observer.disconnect();
  }, [roleIndex]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let revealTimer: ReturnType<typeof setTimeout>;
    const cycle = setInterval(() => {
      setCollapsed(true);
      revealTimer = setTimeout(() => {
        setRoleIndex((previous) => (previous + 1) % sammy.roles.length);
        setCollapsed(false);
      }, 600);
    }, 3100);
    return () => {
      clearInterval(cycle);
      clearTimeout(revealTimer);
    };
  }, []);

  return (
    <>
      <span className="sr-only">{sammy.roles.join(", ")}</span>
      <span
        ref={wrapperRef}
        className={styles.role}
        data-collapsed={collapsed}
        aria-hidden="true"
      >
        <span ref={wordRef} className={styles.roleWord}>
          {sammy.roles[roleIndex]}
        </span>
      </span>
    </>
  );
}
