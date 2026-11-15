"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export function AnimationController() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;

    document.documentElement.dataset.motion = "enabled";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (!isIntersecting) return;
          (target as HTMLElement).dataset.visible = "true";
          observer.unobserve(target);
        });
      },
      { rootMargin: "0px 0px -25px 0px", threshold: 0.01 },
    );

    const selector = "[data-reveal], [data-progress], [data-counter]";
    const observeElements = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches(selector))
        observer.observe(root);
      root
        .querySelectorAll(selector)
        .forEach((element) => observer.observe(element));
    };
    observeElements(document);
    // Streamed route content and dynamically mounted sections need observing too.
    const mutations = new MutationObserver((records) => {
      records.forEach(({ addedNodes }) => {
        addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) observeElements(node);
        });
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    const handlePreferenceChange = () => {
      document.documentElement.dataset.motion = preference.matches
        ? "off"
        : "enabled";
    };
    preference.addEventListener("change", handlePreferenceChange);
    return () => {
      observer.disconnect();
      mutations.disconnect();
      preference.removeEventListener("change", handlePreferenceChange);
      delete document.documentElement.dataset.motion;
    };
  }, [pathname]);

  return null;
}
