import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import styles from "@/app/page.module.css";

const productSections = [
  {
    id: "apps",
    title: "Apps",
    body: "AVRAI apps are the human and business surfaces for discovery, planning, events, profiles, lists, and local coordination.",
    points: [
      "Consumer experiences for finding what fits the moment.",
      "Business experiences for representing a place, offer, or relationship.",
      "Shared flows that move from online context to real-world action.",
    ],
  },
  {
    id: "os",
    title: "OS",
    body: "The AVRAI OS is the operating layer for consent, permissions, receipts, correction, controlled actions, and recovery.",
    points: [
      "Keeps control boundaries separate from the visible page.",
      "Gives people and businesses ways to correct what the system believes.",
      "Supports trustworthy agent and product actions instead of unchecked automation.",
    ],
  },
  {
    id: "model",
    title: "Model",
    body: "The model layer connects people, places, groups, timing, intent, and outcomes so AVRAI can reason about real situations.",
    points: [
      "Models context without reducing people or places to a single score.",
      "Learns from whether a plan, visit, event, or recommendation actually worked.",
      "Turns community signals into better future coordination.",
    ],
  },
];

const serviceSections = [
  {
    title: "APIs",
    body: "AVRAI APIs can expose controlled context for products that need place, event, business, coordination, recommendation, or correction capabilities.",
    points: [
      "Context APIs for people, places, groups, timing, and intent.",
      "Business and venue APIs for profiles, offerings, events, and local fit.",
      "Recommendation and matching APIs for useful next actions.",
      "Correction and receipt APIs so partners can preserve trust boundaries.",
    ],
  },
  {
    title: "MCPs",
    body: "AVRAI MCPs can give approved agents structured ways to ask for context, prepare work, and act through AVRAI boundaries.",
    points: [
      "Agent context lookup for places, businesses, events, and user-approved needs.",
      "Business setup and maintenance tools for operator-facing agents.",
      "Planning tools for lists, groups, visits, and local workflows.",
      "Governed action tools that require clear permission and readback.",
    ],
  },
];

const philosophySections = [
  {
    title: "Not artificial intelligence",
    body: "AVRAI is built around real-world context, not a blank chat box or a feed of guesses.",
    points: [
      "The system understands place, timing, group fit, and outcome.",
      "Useful intelligence is grounded in the situation it is helping with.",
    ],
  },
  {
    title: "Online to offline",
    body: "The goal is to help online natives move their social lives to the real world",
    points: [
      "Digital context makes actual plans, visits, work, and relationships better.",
      "Success is measured by follow-through, not empty engagement.",
    ],
  },
  {
    title: "Community first",
    body: "Local places, businesses, events, and groups become part of one living context layer.",
    points: [
      "Communities need tools that understand local reality.",
      "Businesses and people both need clear ways to be represented.",
    ],
  },
  {
    title: "Doors, not badges",
    body: "AVRAI opens better paths for people instead of turning life into points, streaks, or status loops.",
    points: [
      "AVRAI reduces friction instead of manufacturing attention traps.",
      "good doors provide access, the wrong door provides learning",
    ],
  },
];

export const metadata: Metadata = {
  title: "About",
  description:
    "About AVRAI products, services, philosophy, and team direction.",
};

export default function AboutPage() {
  return (
    <SiteShell currentPath="/about" tone="about">
      <section className={styles.aboutHero}>
        <h1>AVRAI is the intelligence model of real life.</h1>
        <p>
          Our direction is simple: help people, places, businesses, groups, and
          agents coordinate in ways that improve real outcomes.
        </p>
      </section>

      <section className={styles.aboutInteractiveSection}>
        <div className={styles.aboutSectionHeader}>
          <h2>Products</h2>
        </div>

        <div className={styles.detailStack}>
          {productSections.map((item) => (
            <details className={styles.detailPanel} id={item.id} key={item.id}>
              <summary>{item.title}</summary>
              <p>{item.body}</p>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.aboutInteractiveSection}>
        <div className={styles.aboutSectionHeader}>
          <h2>Services</h2>
        </div>

        <div className={styles.detailStack}>
          {serviceSections.map((item) => (
            <details className={styles.detailPanel} key={item.title}>
              <summary>{item.title}</summary>
              <p>{item.body}</p>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.aboutInteractiveSection}>
        <div className={styles.aboutSectionHeader}>
          <h2>Philosophy</h2>
        </div>

        <div className={styles.detailStack}>
          {philosophySections.map((item) => (
            <details className={styles.detailPanel} key={item.title}>
              <summary>{item.title}</summary>
              <p>{item.body}</p>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.teamSection}>
        <h2>Team</h2>
        <p>
          AVRAI is being built by Reis Gordon, an NYU double grad, with a focus
          on useful coded products, closed loops, human satisfaction, and
          agentic systems that reduce unnecessary human effort. The work
          combines product design, full-stack software engineering, runtime
          architecture, automation, privacy boundaries, and applied AI systems
          into one practical build direction.
        </p>
      </section>
    </SiteShell>
  );
}
