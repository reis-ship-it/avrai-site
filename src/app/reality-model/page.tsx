import type { Metadata } from "next";
import Link from "next/link";
import { SitePageHero, SiteShell } from "@/components/site-shell";
import styles from "@/app/page.module.css";

const modelPipeline = [
  {
    label: "State",
    title: "Encode user, entity, and context state",
    body: "Build compact representations from locality, timing, lists, trust, and behavioral signals.",
  },
  {
    label: "Score",
    title: "Use a learned energy surface",
    body: "Replace many static formulas with one learned scoring function over state and candidate action.",
  },
  {
    label: "Simulate",
    title: "Predict how the state can change",
    body: "Model taste drift, list evolution, attendance risk, and action consequences before promotion.",
  },
  {
    label: "Act",
    title: "Choose the next best sequence",
    body: "Move from one-step ranking to planning across lists, groups, reservations, and operator actions.",
  },
];

const trainingLoop = [
  {
    step: "01",
    title: "Observe",
    body: "Collect visits, saves, dismissals, returns, attendance, and operator outcomes.",
  },
  {
    step: "02",
    title: "Consolidate",
    body: "Compress short-term traces into usable memory during low-friction windows.",
  },
  {
    step: "03",
    title: "Fit",
    body: "Train state, scoring, and transition components under device and budget constraints.",
  },
  {
    step: "04",
    title: "Evaluate",
    body: "Shadow new models against incumbent heuristics before anything is promoted.",
  },
  {
    step: "05",
    title: "Promote",
    body: "Ship only the models that clear outcome, privacy, and rollback gates.",
  },
];

const evaluationModes = [
  {
    label: "Offline",
    title: "Representation and ranking tests",
    body: "Check retrieval quality, ranking lift, calibration, and robustness before live exposure.",
  },
  {
    label: "Shadow",
    title: "Side-by-side model comparison",
    body: "Run learned paths against incumbent heuristics to verify win rate and failure behavior.",
  },
  {
    label: "Release",
    title: "Evidence-gated promotion",
    body: "Promotion requires outcome lift, drift review, privacy compliance, and rollback confidence.",
  },
];

export const metadata: Metadata = {
  title: "Reality Model | AVRAI",
  description:
    "A compact view of AVRAI's model pipeline, training loop, and evaluation path for ranking and planning.",
};

export default function RealityModelPage() {
  return (
    <SiteShell currentPath="/reality-model" tone="reality">
      <SitePageHero
        eyebrow="Model overview"
        title="The reality model is a compact pipeline for scoring and planning."
        lede="AVRAI separates representation, scoring, simulation, and action selection into a model stack that can run under real latency, memory, and privacy constraints. The point is better next-action quality through outcome-grounded learning."
        aside={
          <>
            <div className={styles.heroPanelHeader}>
              <p className={styles.sectionLabel}>Model family</p>
              <p className={styles.panelCode}>encode / score / simulate / plan</p>
            </div>
            <p className={styles.heroPanelText}>
              Compact models, bounded training, evidence-gated release.
            </p>
            <div className={styles.heroStats}>
              <div className={styles.statCard}>
                <span>State dimension</span>
                <strong>145-155D</strong>
              </div>
              <div className={styles.statCard}>
                <span>Inference target</span>
                <strong>&lt;200ms</strong>
              </div>
              <div className={styles.statCard}>
                <span>Model footprint</span>
                <strong>&lt;20MB</strong>
              </div>
              <div className={styles.statCard}>
                <span>Release bar</span>
                <strong>eval win</strong>
              </div>
            </div>
          </>
        }
      />

      <section className={styles.pipelineSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.sectionLabel}>Model pipeline</p>
          <h2>Four model jobs, kept legible.</h2>
          <p>
            AVRAI should not collapse representation, ranking, and planning
            into one opaque block.
          </p>
        </div>

        <div className={styles.pipelineRail}>
          {modelPipeline.map((item) => (
            <article className={styles.pipelineCard} key={item.title}>
              <p className={styles.cardLabel}>{item.label}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.trainingLoopSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.sectionLabel}>Training loop</p>
          <h2>Improve the model without unbounded cloud collection.</h2>
        </div>

        <div className={styles.loopGrid}>
          {trainingLoop.map((item) => (
            <article className={styles.loopCard} key={item.step}>
              <span className={styles.processStep}>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.evaluationSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.sectionLabel}>Evaluation path</p>
          <h2>How model changes earn release.</h2>
        </div>

        <div className={styles.evaluationGrid}>
          {evaluationModes.map((item) => (
            <article className={styles.evaluationCard} key={item.title}>
              <p className={styles.cardLabel}>{item.label}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.linkStrip}>
        <article className={styles.linkCard}>
          <p className={styles.sectionLabel}>Boundary discipline</p>
          <h3>See the privacy rules around the model.</h3>
          <p>
            The model is only meaningful if privacy, consent, and transport are
            enforced before promotion and sync.
          </p>
          <Link className={styles.primary} href="/privacy">
            Privacy
          </Link>
        </article>

        <article className={styles.linkCard}>
          <p className={styles.sectionLabel}>Release horizon</p>
          <h3>See when model work moves from research into product.</h3>
          <p>
            The roadmap separates architecture, active model build, and longer
            horizon research.
          </p>
          <Link className={styles.secondary} href="/roadmap">
            Roadmap
          </Link>
        </article>
      </section>
    </SiteShell>
  );
}
