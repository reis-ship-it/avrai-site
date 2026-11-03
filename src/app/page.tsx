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

const pilotRows = [
  {
    title: "Businesses",
    body: "Try the operator portal for business setup, context, actions, and support.",
    href: "https://business.avrai.org",
    cta: "Open business portal",
  },
  {
    title: "Users",
    body: "Join the waitlist for personal discovery, local planning, and real-world coordination.",
    href: "#waitlist",
    cta: "Join waitlist",
  },
  {
    title: "Partners",
    body: "Talk about pilots, integrations, venues, institutions, and local ecosystem work.",
    href: "/contact",
    cta: "Contact AVRAI",
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

      <section className={styles.canonicalSection} id="what-is-avrai">
        <div>
          <p className={styles.eyebrow}>What is AVRAI?</p>
          <h1>AVRAI is an intelligence layer for real life.</h1>
        </div>
        <div className={styles.canonicalCopy}>
          <p>
            AVRAI helps people, businesses, and communities understand context,
            choose better next steps, and improve through feedback while keeping
            action, privacy, and correction under clear control.
          </p>
          <div className={styles.inlineActions}>
            <a className={styles.primaryAction} href="#waitlist">
              Join the waitlist
            </a>
            <Link className={styles.secondaryAction} href="/about">
              Learn more
            </Link>
          </div>
        </div>
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

      <section className={styles.pilotSection} id="pilot">
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Pilot access</p>
          <h2>Start with the path that matches you.</h2>
        </div>
        <div className={styles.pilotGrid}>
          {pilotRows.map((item) => (
            <article className={styles.pilotCard} key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <a href={item.href}>{item.cta}</a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.waitlistSection} id="waitlist">
        <p>join the waitlist</p>
        <WaitlistIntakeForm />
      </section>
    </SiteShell>
  );
}
