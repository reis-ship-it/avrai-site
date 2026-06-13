import type { CSSProperties } from "react";
import styles from "@/app/page.module.css";

const intelligenceWords = [
  "community",
  "local",
  "personal",
  "business",
  "event",
  "party",
  "group",
  "concert",
  "restaurant",
  "cafe",
  "museum",
  "human",
  "reality",
  "anything but artificial",
];

export function IntelligenceScroll() {
  const segmentSize = 100 / (intelligenceWords.length - 1);

  return (
    <section
      className={styles.scrollHero}
      style={
        {
          "--scroll-steps": String(intelligenceWords.length + 1),
        } as CSSProperties
      }
      aria-label="AVRAI intelligence scroll"
    >
      <div className={styles.scrollHeroInner}>
        <div className={styles.scrollWordWrap}>
          <span className={styles.scrollWordViewport}>
            <span className={styles.scrollWordTrack}>
              {intelligenceWords.map((word, index) => {
                const isFirst = index === 0;
                const isLast = index === intelligenceWords.length - 1;
                const rangeStart = Math.max(0, (index - 0.72) * segmentSize);
                const rangeEnd = Math.min(100, (index + 0.72) * segmentSize);

                return (
                  <span
                    className={`${styles.scrollWordSlot} ${
                      isFirst ? styles.scrollWordSlotFirst : ""
                    } ${isLast ? styles.scrollWordSlotLast : ""}`}
                    key={word}
                    style={
                      {
                        "--word-enter": `${rangeStart.toFixed(2)}%`,
                        "--word-exit": `${rangeEnd.toFixed(2)}%`,
                      } as CSSProperties
                    }
                  >
                    {word}
                  </span>
                );
              })}
            </span>
          </span>
          <span className={styles.scrollFixedWord}>intelligence</span>
        </div>
      </div>
    </section>
  );
}
