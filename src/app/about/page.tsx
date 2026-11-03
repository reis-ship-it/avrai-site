import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import styles from "@/app/page.module.css";

const audienceRows = [
  {
    title: "People",
    body: "Find plans, places, events, groups, and next steps that fit the moment.",
  },
  {
    title: "Businesses",
    body: "Represent what a business is, who it serves, and what should happen next.",
  },
  {
    title: "Communities",
    body: "See local relationships, gaps, demand, and coordination paths without flattening reality.",
  },
  {
    title: "Agents",
    body: "Use bounded context, receipts, and permissioned actions instead of guessing from a prompt.",
  },
];

const workflowRows = [
  {
    label: "1",
    title: "Read context",
    body: "AVRAI connects people, places, businesses, groups, timing, intent, and outcomes.",
  },
  {
    label: "2",
    title: "Suggest next steps",
    body: "The system turns context into reviewable options, not automatic authority.",
  },
  {
    label: "3",
    title: "Learn from feedback",
    body: "Corrections, receipts, and real outcomes improve future coordination.",
  },
];

const trustRows = [
  {
    title: "Consent",
    body: "People and businesses should know what is being used and why.",
  },
  {
    title: "Control",
    body: "Pages can submit and review actions, but Runtime OS owns action boundaries.",
  },
  {
    title: "Correction",
    body: "Representations need clear paths to review, fix, challenge, and update.",
  },
  {
    title: "No hidden authority",
    body: "Demos and agents stay bounded until evidence, permissions, and receipts support more.",
  },
];

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
    "What AVRAI is, who it is for, how it works, and how it keeps intelligence bounded by trust, privacy, and correction.",
};

export default function AboutPage() {
  return (
    <SiteShell currentPath="/about" tone="about">
      <section className={styles.aboutHero}>
        <h1>
          AVRAI is the intelligence model of real life. AVRAI is not an LLM
          wrapper.
        </h1>
        <p>
          AVRAI helps people, businesses, and communities understand context,
          choose better next steps, and improve through feedback while keeping
          action, privacy, and correction under clear control.
        </p>
      </section>

      <section className={styles.audienceSection} id="who-it-is-for">
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Who it is for</p>
          <h2>People, businesses, communities, and agents.</h2>
        </div>
        <div className={styles.compactGrid}>
          {audienceRows.map((item) => (
            <article className={styles.compactCard} key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.workflowSection} id="how-it-works">
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>How it works</p>
          <h2>Context becomes options, then feedback becomes better context.</h2>
        </div>
        <div className={styles.workflowList}>
          {workflowRows.map((item) => (
            <article key={item.title}>
              <span>{item.label}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.trustSection} id="trust-and-privacy">
        <div>
          <p className={styles.eyebrow}>Trust and privacy</p>
          <h2>Useful intelligence needs boundaries.</h2>
          <p>
            AVRAI is designed around reviewable context, consent, receipts,
            correction, and controlled action. The public demos show the shape
            of the system without claiming live authority or hidden certainty.
          </p>
        </div>
        <div className={styles.trustDiagram} aria-label="AVRAI trust controls">
          {trustRows.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
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
