import type { Metadata } from "next";
import { SitePageHero, SiteShell } from "@/components/site-shell";
import { WaitlistForm } from "@/components/waitlist-form";
import styles from "@/app/page.module.css";

const collaborationLanes = [
  {
    label: "Operator pilot",
    title: "Venues, hosts, and live workflow partners",
    bring: "A real workflow, real constraints, and real operational feedback.",
    avrai: "Product iteration, planning logic, and tooling tuned to local operations.",
    output: "A scoped pilot with measurable workflow or attendance improvement.",
  },
  {
    label: "Research collaboration",
    title: "Model, privacy, and systems work",
    bring: "Technical depth in world models, federation, evaluation, or runtime governance.",
    avrai: "A concrete product setting where those ideas can be tested under constraints.",
    output: "A sharper model stack, better evaluations, or stronger privacy architecture.",
  },
  {
    label: "Deployment program",
    title: "Institutions and enterprise infrastructure teams",
    bring: "A deployment environment, an operating problem, or a wider distribution path.",
    avrai: "A privacy-first stack for discovery, coordination, and operator intelligence.",
    output: "A serious deployment path, not a sponsorship-driven partnership page.",
  },
];

const engagementSteps = [
  {
    step: "01",
    title: "Initial signal",
    body: "Start with a real workflow, systems question, or deployment need.",
  },
  {
    step: "02",
    title: "Working session",
    body: "Use one session to define scope, constraints, data boundaries, and success criteria.",
  },
  {
    step: "03",
    title: "Scoped plan",
    body: "Turn the conversation into a bounded pilot, research brief, or deployment path.",
  },
  {
    step: "04",
    title: "Execution review",
    body: "Measure output quality, privacy posture, and operational usefulness before expanding.",
  },
];

export const metadata: Metadata = {
  title: "Partners | AVRAI",
  description:
    "How AVRAI works with operator pilots, research collaborators, and deployment partners.",
};

export default function PartnersPage() {
  return (
    <SiteShell currentPath="/partners" tone="partners">
      <SitePageHero
        eyebrow="Partnerships"
        title="AVRAI has three collaboration lanes."
        lede="The best partnerships are concrete. They improve product workflows, model rigor, or deployment quality. AVRAI is looking for operators, technical collaborators, and infrastructure partners who want to work on something specific."
        aside={
          <>
            <div className={styles.heroPanelHeader}>
              <p className={styles.sectionLabel}>Best entry points</p>
              <p className={styles.panelCode}>pilot / research / deployment</p>
            </div>
            <p className={styles.heroPanelText}>
              The strongest conversations start with a real operating problem.
            </p>
            <ul className={styles.heroPanelList}>
              <li>Operator pilots with workflow evidence</li>
              <li>Technical collaboration with clear research questions</li>
              <li>Deployment work with an actual environment</li>
            </ul>
          </>
        }
      />

      <section className={styles.partnershipSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.sectionLabel}>Collaboration lanes</p>
          <h2>Each lane has a different shape.</h2>
        </div>

        <div className={styles.laneGrid}>
          {collaborationLanes.map((item) => (
            <article className={styles.laneCard} key={item.title}>
              <p className={styles.cardLabel}>{item.label}</p>
              <h3>{item.title}</h3>
              <div className={styles.laneSplit}>
                <div className={styles.laneBlock}>
                  <span>You bring</span>
                  <p>{item.bring}</p>
                </div>
                <div className={styles.laneBlock}>
                  <span>AVRAI brings</span>
                  <p>{item.avrai}</p>
                </div>
              </div>
              <p className={styles.laneOutcome}>{item.output}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.engagementSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.sectionLabel}>Engagement path</p>
          <h2>How a conversation should turn into work.</h2>
        </div>

        <div className={styles.engagementRail}>
          {engagementSteps.map((item) => (
            <article className={styles.engagementCard} key={item.step}>
              <span className={styles.processStep}>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.waitlistSection}>
        <div className={styles.waitlistIntro}>
          <p className={styles.sectionLabel}>Start here</p>
          <h2>Tell us which lane you are evaluating.</h2>
          <p>
            Use the form for operator pilots, research collaboration, or
            deployment conversations.
          </p>
        </div>
        <WaitlistForm />
      </section>
    </SiteShell>
  );
}
