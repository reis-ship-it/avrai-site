"use client";

import { useState } from "react";
import styles from "@/app/page.module.css";

type ProngId = "applications" | "runtime" | "model";

type Prong = {
  id: ProngId;
  label: string;
  shortLabel: string;
  nodeHint: string;
  boxNote: string;
  title: string;
  summary: string;
  owns: string;
  receives: string;
  returns: string;
};

const prongs: Prong[] = [
  {
    id: "applications",
    label: "Applications",
    shortLabel: "Experience layer",
    nodeHint: "discover / plan / operate",
    boxNote: "Applications create intent, usage, and real-world outcomes.",
    title: "Turns system quality into user value.",
    summary:
      "This prong owns the product surfaces people and operators actually use.",
    owns: "Discovery, lists, shared planning, reservations, and operator workflows.",
    receives: "Runtime capabilities plus scores and plans promoted by the model.",
    returns: "Intent, feedback, visits, attendance, and other lived outcomes.",
  },
  {
    id: "runtime",
    label: "Runtime",
    shortLabel: "Control layer",
    nodeHint: "identity / policy / release",
    boxNote: "Runtime governs identity, policy, transport, and release gates.",
    title: "Keeps the stack private, governable, and releasable.",
    summary:
      "This prong is the control boundary for consent, policy, transport, and release.",
    owns: "Consent, transport, authorization, rollout, rollback, sync, and recovery.",
    receives: "User actions and model candidates that need bounded execution.",
    returns: "Approved calls, data movement, and release decisions.",
  },
  {
    id: "model",
    label: "Reality model",
    shortLabel: "Decision layer",
    nodeHint: "rank / predict / plan",
    boxNote: "Reality model returns scores, predictions, plans, and better next actions.",
    title: "Makes the stack learn from outcomes.",
    summary:
      "This prong improves ranking, forecasting, and next-action quality from lived outcomes.",
    owns: "State representation, scoring, transition prediction, and planning.",
    receives: "Behavioral signals, contextual state, and runtime-approved inference windows.",
    returns: "Scores, forecasts, and model candidates that can outperform heuristics.",
  },
];

export function ProngSystem() {
  const [activeId, setActiveId] = useState<ProngId>("model");
  const activeProng = prongs.find((prong) => prong.id === activeId) ?? prongs[2];

  return (
    <div className={styles.prongExperience}>
      <div className={styles.prongBackdrop} />

      <div className={styles.prongCanvas}>
        <div className={styles.prongCanvasHeader}>
          <p className={styles.sectionLabel}>System map</p>
          <p className={styles.panelCode}>three prongs / one contract boundary</p>
        </div>

        <div className={styles.prongRow}>
          {prongs.map((prong) => (
            <button
              key={prong.id}
              className={`${styles.prongNode} ${
                activeId === prong.id ? styles.prongNodeActive : ""
              }`}
              aria-pressed={activeId === prong.id}
              onClick={() => setActiveId(prong.id)}
              type="button"
            >
              <i aria-hidden="true" className={styles.prongNodeSignal} />
              <div className={styles.prongNodeHeader}>
                <span>{prong.label}</span>
                <strong>{prong.shortLabel}</strong>
                <em>{prong.nodeHint}</em>
              </div>
              <p className={styles.prongNodeCopy}>{prong.boxNote}</p>
            </button>
          ))}
        </div>

        <svg
          aria-hidden="true"
          className={styles.prongConnectorSvg}
          viewBox="0 0 1200 140"
        >
          <path
            className={`${styles.prongConnector} ${
              activeId === "applications" ? styles.prongConnectorActive : ""
            }`}
            d="M200 0 C 200 42, 252 68, 322 104"
          />
          <path
            className={`${styles.prongConnector} ${
              activeId === "runtime" ? styles.prongConnectorActive : ""
            }`}
            d="M600 0 L600 104"
          />
          <path
            className={`${styles.prongConnector} ${
              activeId === "model" ? styles.prongConnectorActive : ""
            }`}
            d="M1000 0 C 1000 42, 948 68, 878 104"
          />
        </svg>

        <div className={styles.prongRail}>
          <span>Shared contracts</span>
          <strong>Data boundary and release boundary across all three prongs</strong>
        </div>
      </div>

      <article className={styles.prongDetail}>
        <div className={styles.prongDetailHeader}>
          <div className={styles.prongDetailEyebrow}>
            <p className={styles.sectionLabel}>Selected prong</p>
            <p className={styles.cardLabel}>{activeProng.label}</p>
          </div>
          <p className={styles.panelCode}>click a prong to inspect its role</p>
        </div>
        <h3>{activeProng.title}</h3>
        <p className={styles.prongDetailSummary}>{activeProng.summary}</p>

        <div className={styles.prongDetailGrid}>
          <article className={styles.prongDetailCard}>
            <span>Owns</span>
            <p>{activeProng.owns}</p>
          </article>

          <article className={styles.prongDetailCard}>
            <span>Receives</span>
            <p>{activeProng.receives}</p>
          </article>

          <article className={styles.prongDetailCard}>
            <span>Returns</span>
            <p>{activeProng.returns}</p>
          </article>
        </div>
      </article>
    </div>
  );
}
