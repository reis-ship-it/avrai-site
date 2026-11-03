import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const principles = [
  {
    number: "01",
    title: "The moment matters",
    body: "Who you are with, when you are going, and what you need can change the right choice.",
  },
  {
    number: "02",
    title: "You choose the next step",
    body: "Useful suggestions should help you decide, with room to change course or say no.",
  },
  {
    number: "03",
    title: "Feedback has a purpose",
    body: "What worked and what did not can help make future suggestions more relevant.",
  },
];

export default function Home() {
  return (
    <SiteShell currentPath="/">
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>AVRAI · Early access</p>
          <h1 id="home-title">Find places and plans that fit the moment.</h1>
          <p className={styles.heroLede}>
            We’re building AVRAI to help people decide where to go and what to
            do with their timing, company, and context in mind.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} href="/access">
              Request access <span aria-hidden="true">↗</span>
            </Link>
            <a className={styles.textAction} href="#how-it-works">
              See what we’re building
            </a>
          </div>
        </div>
        <div className={styles.heroAside} aria-label="An example of real-world context">
          <p className={styles.asideLabel}>A familiar decision</p>
          <p className={styles.asideTitle}>Where should we go after the show?</p>
          <p>
            Somewhere nearby, still open, and comfortable for the people you’re
            with. The details change the answer.
          </p>
        </div>
      </section>

      <section className={styles.explainer} id="how-it-works">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>What we’re building</p>
          <h2>Better decisions start with better context.</h2>
          <p>
            AVRAI is being designed around real situations, useful choices, and
            the ability to correct what it gets wrong.
          </p>
        </div>
        <div className={styles.principles}>
          {principles.map((principle) => (
            <article className={styles.principle} key={principle.number}>
              <span className={styles.principleNumber}>{principle.number}</span>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.closing}>
        <div>
          <p className={styles.eyebrow}>Be part of the pilot</p>
          <h2>Interested in trying AVRAI?</h2>
          <p>Tell us you’d like to hear about access as the pilot develops.</p>
        </div>
        <Link className={styles.primaryAction} href="/access">
          Request access <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </SiteShell>
  );
}
