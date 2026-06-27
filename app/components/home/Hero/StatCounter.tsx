"use client";

import { useEffect, useState } from "react";

type StatCounterProps = {
  durationMs?: number;
  end: number;
  prefix?: string;
  suffix?: string;
};

export function StatCounter({
  durationMs = 1400,
  end,
  prefix = "",
  suffix = "",
}: StatCounterProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frameId = 0;
    let startTime = 0;

    const step = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(end * eased));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };

    frameId = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(frameId);
  }, [durationMs, end]);

  return (
    <span>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
