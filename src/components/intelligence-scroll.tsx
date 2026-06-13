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
  return (
    <section
      className={styles.scrollHero}
      data-intelligence-scroll
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

                return (
                  <span
                    className={styles.scrollWordSlot}
                    data-intelligence-word
                    key={word}
                    style={
                      {
                        opacity: isFirst ? 1 : 0,
                        zIndex: isLast ? 2 : 1,
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
