"use client";

import { useEffect, useState } from "react";
import styles from "./Clock.module.css";

function getLocalTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

export default function Clock() {
  const [clock, setClock] = useState({ current: "--:--:--", previous: "--:--:--" });

  useEffect(() => {
    let intervalId: number | undefined;
    let timeoutId: number | undefined;

    const update = () => {
      const nextTime = getLocalTime();
      setClock((previousClock) =>
        previousClock.current === nextTime
          ? previousClock
          : { current: nextTime, previous: previousClock.current },
      );
    };
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

  return (
    <time className={styles.time} aria-label={`Visitor local time ${clock.current}`}>
      {Array.from(clock.current).map((character, index) => {
        const previousCharacter = clock.previous[index] ?? character;
        const changed = character !== previousCharacter;

        return (
          <span
            className={styles.character}
            data-changed={changed}
            data-previous-character={previousCharacter}
            key={`${index}-${changed ? `${previousCharacter}-${character}` : character}`}
            aria-hidden="true"
          >
            <span className={`${styles.current}${changed ? ` ${styles.incoming}` : ""}`}>
              {character}
            </span>
          </span>
        );
      })}
    </time>
  );
}
