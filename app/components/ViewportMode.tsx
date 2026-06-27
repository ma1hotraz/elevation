"use client";

import { useEffect } from "react";

const COMPACT_BREAKPOINT = 860;
const NARROW_BREAKPOINT = 520;
const TINY_BREAKPOINT = 360;
const VIEWPORT_MISMATCH_BUFFER = 120;

function syncViewportMode() {
  const root = document.documentElement;
  const screenShortEdge = Math.min(window.screen.width, window.screen.height);
  const hasTouchViewport =
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(hover: none)").matches;
  const shouldForceCompact =
    hasTouchViewport &&
    screenShortEdge <= COMPACT_BREAKPOINT &&
    window.innerWidth > screenShortEdge + VIEWPORT_MISMATCH_BUFFER;

  root.toggleAttribute("data-force-compact", shouldForceCompact);
  root.toggleAttribute(
    "data-force-narrow",
    shouldForceCompact && screenShortEdge <= NARROW_BREAKPOINT,
  );
  root.toggleAttribute(
    "data-force-tiny",
    shouldForceCompact && screenShortEdge <= TINY_BREAKPOINT,
  );
}

export function ViewportMode() {
  useEffect(() => {
    syncViewportMode();

    window.addEventListener("resize", syncViewportMode);
    window.addEventListener("orientationchange", syncViewportMode);

    return () => {
      window.removeEventListener("resize", syncViewportMode);
      window.removeEventListener("orientationchange", syncViewportMode);
    };
  }, []);

  return null;
}
