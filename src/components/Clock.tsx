"use client";

import { useEffect, useState } from "react";

function getLocalTime() {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());
  } catch {
    return "--:--";
  }
}

export default function Clock() {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    let intervalId: number | undefined;

    const update = () => setTime(getLocalTime());
    const startMinuteInterval = () => {
      window.clearInterval(intervalId);
      intervalId = window.setInterval(update, 60_000);
    };

    update();
    const msUntilNextMinute = 60_000 - (Date.now() % 60_000);
    const timeoutId = window.setTimeout(() => {
      update();
      startMinuteInterval();
    }, msUntilNextMinute);

    const handleVisibility = () => {
      if (!document.hidden) update();
    };

    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <time className="clock" aria-label="Visitor local time">
      {time}
    </time>
  );
}
