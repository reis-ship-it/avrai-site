import Link from "next/link";
import { IntelligenceScroll } from "@/components/intelligence-scroll";
import { SiteShell } from "@/components/site-shell";
import { productPillars } from "@/components/site-content";
import { WaitlistIntakeForm } from "@/components/waitlist-intake-form";
import styles from "./page.module.css";

const realityRows = [
  {
    label: "People",
    body: "What someone likes, needs, avoids, and returns to over time.",
  },
  {
    label: "Places",
    body: "Restaurants, cafes, museums, venues, neighborhoods, and local spaces.",
  },
  {
    label: "Moments",
    body: "Groups, timing, weather, events, energy, constraints, and intent.",
  },
  {
    label: "Outcomes",
    body: "Whether the plan worked, the visit fit, and the next choice improved.",
  },
];

export default function Home() {
  return (
    <SiteShell currentPath="/" tone="home">
      <IntelligenceScroll />

      <section className={styles.postCarouselStatement}>
        <p>
          One context model for local discovery, planning, business
          relationships, and shared real-world decisions.
        </p>
      </section>

      <section className={styles.productStrip}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>What we are building</p>
          <h2>Apps, OS, and Model.</h2>
        </div>

        <div className={styles.productRows}>
          {productPillars.map((item) => (
            <Link className={styles.productRow} href={item.href} key={item.title}>
              <span>{item.title}</span>
              <p>{item.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.realitySection}>
        <div>
          <p className={styles.eyebrow}>Reality, contextualized</p>
          <h2>AVRAI understands context across real situations.</h2>
          <p>
            A restaurant is different at lunch, after a concert, for a date,
            with a group, or when someone needs a quiet place to think. AVRAI is
            designed for that kind of context.
          </p>
        </div>

        <div className={styles.realityList}>
          {realityRows.map((item) => (
            <article key={item.label}>
              <h3>{item.label}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.waitlistSection}>
        <p>join the waitlist</p>
        <WaitlistIntakeForm />
      </section>
    </SiteShell>
  );
}
