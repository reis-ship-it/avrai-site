import type { Metadata } from "next";
import Link from "next/link";
import { SitePageHero, SiteShell } from "@/components/site-shell";
import styles from "@/app/page.module.css";

const roadmapPhases = [
  {
    key: "now",
    label: "Now",
    summary: "Architecture and core framing",
  },
  {
    key: "build",
    label: "Building",
    summary: "Active product, runtime, and model delivery",
  },
  {
    key: "next",
    label: "Next",
    summary: "Longer-horizon expansion",
  },
];

const roadmapLanes = [
  {
    lane: "Product",
    detail: "Discovery, planning, attendance, operations",
    phases: {
      now: [
        "Public framing for places, lists, groups, and events",
        "Clear separation between user and operator surfaces",
      ],
      build: [
        "Reservations, venue tooling, and deeper planning workflows",
        "Better end-to-end flows from discovery to attendance",
      ],
      next: [
        "Broader service pathways and richer operator intelligence",
        "Deeper multi-party planning across more contexts",
      ],
    },
  },
  {
    lane: "Runtime",
    detail: "Identity, policy, transport, rollout",
    phases: {
      now: [
        "Privacy-first execution model and contract boundaries",
        "Consent, policy, and fail-closed direction in the architecture",
      ],
      build: [
        "Stronger transport, rollout, rollback, and recovery mechanics",
        "Operator controls that stay inside the privacy boundary",
      ],
      next: [
        "More robust AI2AI coordination and endpoint orchestration",
        "Wider deployments under the same runtime standards",
      ],
    },
  },
  {
    lane: "Model",
    detail: "State, scoring, simulation, planning",
    phases: {
      now: [
        "State schema, model contracts, and evaluation logic",
        "A compact model profile for constrained devices",
      ],
      build: [
        "Replacement of heuristics with learned scoring and transition models",
        "Planning over lists, groups, and operator actions",
      ],
      next: [
        "Broader world-model behavior and longer-horizon planning",
        "More capable federated improvement and ecosystem intelligence",
      ],
    },
  },
];

const proofStandard = [
  {
    label: "Deployments",
    title: "Where the system is live",
    body: "Public proof should show where AVRAI is actually deployed and what workflow it is serving.",
  },
  {
    label: "Evals",
    title: "How the model is judged",
    body: "Model changes should be backed by evaluation summaries, shadow results, and release gates.",
  },
  {
    label: "Releases",
    title: "What changed and what improved",
    body: "Release notes should explain what shipped, why it shipped, and what measurable lift was observed.",
  },
];

export const metadata: Metadata = {
  title: "Roadmap | AVRAI",
  description:
    "A lane-based roadmap for AVRAI across product, runtime, and model work.",
};

export default function RoadmapPage() {
  return (
    <SiteShell currentPath="/roadmap" tone="roadmap">
      <SitePageHero
        eyebrow="Roadmap"
        title="The roadmap is split across product, runtime, and model lanes."
        lede="AVRAI is building three systems in parallel, so the roadmap should look like an actual roadmap. Product, runtime, and model work move on different clocks and only come together at release time."
        aside={
          <>
            <div className={styles.heroPanelHeader}>
              <p className={styles.sectionLabel}>Execution rule</p>
              <p className={styles.panelCode}>parallel lanes / gated release</p>
            </div>
            <p className={styles.heroPanelText}>
              Move fast inside each lane. Promote only when the lanes still fit
              together.
            </p>
            <ul className={styles.heroPanelList}>
              <li>Product depth without runtime drift</li>
              <li>Runtime rigor without product stagnation</li>
              <li>Model progress without privacy regression</li>
            </ul>
          </>
        }
      />

      <section className={styles.roadmapSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.sectionLabel}>Execution map</p>
          <h2>An actual roadmap, organized by lane and phase.</h2>
        </div>

        <div className={styles.roadmapMatrix}>
          <div className={styles.roadmapCorner} />
          {roadmapPhases.map((phase) => (
            <div className={styles.roadmapHeaderCell} key={phase.key}>
              <p className={styles.cardLabel}>{phase.label}</p>
              <h3>{phase.summary}</h3>
            </div>
          ))}

          {roadmapLanes.map((lane) => (
            <div className={styles.roadmapRow} key={lane.lane}>
              <div className={styles.roadmapLabelCard}>
                <p className={styles.cardLabel}>{lane.lane}</p>
                <p>{lane.detail}</p>
              </div>

              {roadmapPhases.map((phase) => (
                <article
                  className={styles.roadmapCell}
                  data-phase={phase.label}
                  key={`${lane.lane}-${phase.key}`}
                >
                  <ul className={styles.bulletList}>
                    {lane.phases[phase.key as keyof typeof lane.phases].map(
                      (entry) => (
                        <li key={entry}>{entry}</li>
                      ),
                    )}
                  </ul>
                </article>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.proofSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.sectionLabel}>Proof standard</p>
          <h2>What the public record should eventually contain.</h2>
        </div>

        <div className={styles.proofGrid}>
          {proofStandard.map((item) => (
            <article className={styles.proofCard} key={item.title}>
              <p className={styles.cardLabel}>{item.label}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.linkStrip}>
        <article className={styles.linkCard}>
          <p className={styles.sectionLabel}>Product lane</p>
          <h3>See the workloads inside the product track.</h3>
          <p>
            The platform page shows how discovery, planning, reservations, and
            operations fit together.
          </p>
          <Link className={styles.primary} href="/platform">
            Platform
          </Link>
        </article>

        <article className={styles.linkCard}>
          <p className={styles.sectionLabel}>Model lane</p>
          <h3>See what is driving the model track.</h3>
          <p>
            The reality-model page explains state, scoring, simulation, and
            evaluation in more detail.
          </p>
          <Link className={styles.secondary} href="/reality-model">
            Reality model
          </Link>
        </article>
      </section>
    </SiteShell>
  );
}
