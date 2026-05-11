import type { Metadata } from "next";
import Link from "next/link";
import { SitePageHero, SiteShell } from "@/components/site-shell";
import styles from "@/app/page.module.css";

const privacyZones = [
  {
    label: "On device",
    title: "Local state and local inference",
    items: [
      "Identity, preferences, memory, and recommendation state stay closest to the user.",
      "Ranking, adaptation, and correction loops are designed to run locally first.",
    ],
  },
  {
    label: "Encrypted transfer",
    title: "Movement only for active coordination",
    items: [
      "Shared planning, reservations, and AI2AI coordination use explicit transport pathways.",
      "Data movement is policy-checked, encrypted, and scoped to a live task.",
    ],
  },
  {
    label: "Federated cloud",
    title: "A narrow role for sync, delivery, and aggregation",
    items: [
      "The cloud distributes models, supports encrypted sync, and aggregates privacy-safe updates.",
      "The goal is system improvement without building a raw-history warehouse.",
    ],
  },
];

const privacyGates = [
  {
    step: "01",
    title: "Consent scope",
    body: "Learning, sharing, and cross-context use should all be separately bounded by consent.",
  },
  {
    step: "02",
    title: "Policy resolution",
    body: "Unknown or incompatible states fail closed before action, sync, or model promotion.",
  },
  {
    step: "03",
    title: "Operator access",
    body: "Operator surfaces are for workflow and telemetry, not personal dossiers or message scraping.",
  },
  {
    step: "04",
    title: "Revocation and cleanup",
    body: "Deletion, export, and revocation need to remove or invalidate affected local learning state.",
  },
];

const privacyRules = [
  "Default local",
  "Explicit consent",
  "Encrypted transfer",
  "Fail closed",
];

export const metadata: Metadata = {
  title: "Privacy | AVRAI",
  description:
    "How AVRAI handles local inference, encrypted transport, consent-gated data movement, and privacy-preserving model improvement.",
};

export default function PrivacyPage() {
  return (
    <SiteShell currentPath="/privacy" tone="privacy">
      <SitePageHero
        eyebrow="Privacy architecture"
        title="Privacy is a boundary system, not a settings page."
        lede="AVRAI separates local state, encrypted coordination, and federated improvement into different operating zones. The privacy claim depends on what can stay local, what is allowed to move, and which controls must resolve before any action."
        aside={
          <>
            <div className={styles.heroPanelHeader}>
              <p className={styles.sectionLabel}>Boundary profile</p>
              <p className={styles.panelCode}>
                device / encrypted transfer / federated cloud
              </p>
            </div>
            <p className={styles.heroPanelText}>
              Local-first by default, narrow sync when needed.
            </p>
            <ul className={styles.heroPanelList}>
              <li>Local inference before cloud inference</li>
              <li>Consent before sharing</li>
              <li>Encrypted transport before sync</li>
              <li>Privacy-safe aggregation before promotion</li>
            </ul>
          </>
        }
      />

      <section className={styles.boundarySection}>
        <div className={styles.sectionIntro}>
          <p className={styles.sectionLabel}>Boundary map</p>
          <h2>Three zones. Three different permissions.</h2>
          <p>
            AVRAI becomes easier to understand when privacy is framed as an
            operating map rather than a generic policy statement.
          </p>
        </div>

        <div className={styles.zoneGrid}>
          {privacyZones.map((item) => (
            <article className={styles.zoneCard} key={item.title}>
              <div className={styles.zoneHeader}>
                <p className={styles.cardLabel}>{item.label}</p>
                <div className={styles.zoneSignal} />
              </div>
              <h3>{item.title}</h3>
              <ul className={styles.bulletList}>
                {item.items.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className={styles.ruleRail} aria-label="Privacy operating rules">
          {privacyRules.map((rule) => (
            <span className={styles.ruleChip} key={rule}>
              {rule}
            </span>
          ))}
        </div>
      </section>

      <section className={styles.controlSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.sectionLabel}>Control gates</p>
          <h2>The points where the privacy claim is enforced.</h2>
        </div>

        <div className={styles.gateGrid}>
          {privacyGates.map((item) => (
            <article className={styles.gateCard} key={item.step}>
              <span className={styles.processStep}>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.linkStrip}>
        <article className={styles.linkCard}>
          <p className={styles.sectionLabel}>Next layer</p>
          <h3>See the model stack behind the boundary.</h3>
          <p>
            Privacy defines the perimeter. The reality model defines how
            ranking, planning, and adaptation work inside it.
          </p>
          <Link className={styles.primary} href="/reality-model">
            Reality model
          </Link>
        </article>

        <article className={styles.linkCard}>
          <p className={styles.sectionLabel}>Operating surface</p>
          <h3>See where those boundaries matter in product workflows.</h3>
          <p>
            Discovery, planning, reservations, and operator tools all sit on
            top of the same privacy runtime.
          </p>
          <Link className={styles.secondary} href="/platform">
            Platform
          </Link>
        </article>
      </section>
    </SiteShell>
  );
}
