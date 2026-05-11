import type { Metadata } from "next";
import Link from "next/link";
import { SitePageHero, SiteShell } from "@/components/site-shell";
import styles from "@/app/page.module.css";

const journeyStages = [
  {
    label: "01",
    title: "Discover",
    body: "Find places, events, and service options worth considering.",
  },
  {
    label: "02",
    title: "Shortlist",
    body: "Turn raw options into lists, saves, and shared candidate sets.",
  },
  {
    label: "03",
    title: "Coordinate",
    body: "Move from personal intent to group plans, reservations, and commitments.",
  },
  {
    label: "04",
    title: "Attend and operate",
    body: "Support the final experience for both participants and operators.",
  },
];

const operatingSurfaces = [
  {
    label: "User surface",
    title: "Discovery and personal planning",
    items: [
      "Place discovery, contextual recommendations, and saved lists.",
      "A product surface tuned for better decisions, not more scrolling.",
    ],
  },
  {
    label: "Shared context",
    title: "Group plans and joint decisions",
    items: [
      "Lists, availability, and shared context reduce coordination friction.",
      "This is where single-user ranking becomes multi-party planning.",
    ],
  },
  {
    label: "Operator surface",
    title: "Reservations, venues, and service workflows",
    items: [
      "Hosts and venues need workflow tooling, not just demand generation.",
      "Operator value should respect the same privacy boundary as the user side.",
    ],
  },
];

const platformSignals = ["Places", "Lists", "Groups", "Reservations"];

export const metadata: Metadata = {
  title: "Platform | AVRAI",
  description:
    "How the AVRAI platform moves from discovery to coordination, attendance, and venue operations.",
};

export default function PlatformPage() {
  return (
    <SiteShell currentPath="/platform" tone="platform">
      <SitePageHero
        eyebrow="Platform overview"
        title="AVRAI connects discovery, planning, attendance, and venue operations."
        lede="The product is not just a recommendation feed. It is a workload stack that starts with discovery, moves through shared decisions, and ends in real attendance, reservations, and operator workflows."
        aside={
          <>
            <div className={styles.heroPanelHeader}>
              <p className={styles.sectionLabel}>Operating arc</p>
              <p className={styles.panelCode}>discover / shortlist / coordinate / operate</p>
            </div>
            <p className={styles.heroPanelText}>
              Demand-side and supply-side workflows in one system.
            </p>
            <div className={styles.flowRail}>
              {platformSignals.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </>
        }
      />

      <section className={styles.journeySection}>
        <div className={styles.sectionIntro}>
          <p className={styles.sectionLabel}>Workload map</p>
          <h2>A platform journey, not a single recommendation moment.</h2>
          <p>
            Each stage has different UX, different runtime needs, and different
            model requirements.
          </p>
        </div>

        <div className={styles.journeyRail}>
          {journeyStages.map((item) => (
            <article className={styles.journeyCard} key={item.title}>
              <span className={styles.journeyBadge}>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.surfaceSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.sectionLabel}>Operating surfaces</p>
          <h2>Three surfaces with different jobs.</h2>
        </div>

        <div className={styles.surfaceGrid}>
          {operatingSurfaces.map((item) => (
            <article className={styles.surfaceCard} key={item.title}>
              <p className={styles.cardLabel}>{item.label}</p>
              <h3>{item.title}</h3>
              <ul className={styles.bulletList}>
                {item.items.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.linkStrip}>
        <article className={styles.linkCard}>
          <p className={styles.sectionLabel}>Collaboration lanes</p>
          <h3>See who the platform is built with.</h3>
          <p>
            Operator pilots, technical collaboration, and infrastructure work
            shape how the platform gets deployed.
          </p>
          <Link className={styles.primary} href="/partners">
            Partners
          </Link>
        </article>

        <article className={styles.linkCard}>
          <p className={styles.sectionLabel}>Execution horizon</p>
          <h3>See what is live, what is in build, and what is next.</h3>
          <p>
            The roadmap separates current product scope from active model and
            runtime work.
          </p>
          <Link className={styles.secondary} href="/roadmap">
            Roadmap
          </Link>
        </article>
      </section>
    </SiteShell>
  );
}
