import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import styles from "@/app/page.module.css";

const operatorReasons = [
  "Free to start",
  "Keep your vibe, offers, events, and updates aligned in one place",
  "See which local moments, groups, and patterns fit your operation",
  "Prepare better follow-up without guessing what people need next",
  "Give staff and future agents clearer context to act from",
];

export const metadata: Metadata = {
  title: "Business",
  description:
    "AVRAI Business helps local businesses build real-world context and serve the people around them.",
};

export default function BusinessPage() {
  return (
    <SiteShell currentPath="/business" tone="business">
      <section className={styles.businessHero}>
        <h1>
          <span className={styles.underlinedText}>AVRAI Business</span> helps
          operators understand and serve their real community.
        </h1>
        <h2>
          <span className={styles.underlinedText}>AVRAI Business</span> learns
          the shape of your business.
        </h2>
        <p>
          Keep your vibe, customers, local moments, and follow-up in one
          operator flow.
        </p>
      </section>

      <section className={styles.businessReasons}>
        <h2>Why operators try it</h2>
        <ol>
          {operatorReasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ol>
      </section>

      <section className={styles.businessCta}>
        <h2>Use the business site for the operator flow.</h2>
        <div className={styles.ctaActions}>
          <a className={styles.primaryAction} href="https://business.avrai.org">
            signup
          </a>
          <Link className={styles.secondaryAction} href="/contact">
            contact
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
