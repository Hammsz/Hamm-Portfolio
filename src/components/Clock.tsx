"use client";

import { useEffect, useState } from "react";

function getLocalTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

export default function Clock() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    let intervalId: number | undefined;
    let timeoutId: number | undefined;

    const update = () => setTime(getLocalTime());
    const clearTimers = () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
    const sync = () => {
      clearTimers();
      update();

      const msUntilNextSecond = 1_000 - (Date.now() % 1_000);
      timeoutId = window.setTimeout(() => {
        update();
        intervalId = window.setInterval(update, 1_000);
      }, msUntilNextSecond);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        clearTimers();
      } else {
        sync();
      }
    };

    sync();
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearTimers();
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return <time aria-label={`Visitor local time ${time}`}>{time}</time>;
}
