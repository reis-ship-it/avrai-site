import type { Metadata } from "next";
import { BusinessSignupForm } from "@/components/business-signup-form";
import { SitePageHero, SiteShell } from "@/components/site-shell";
import styles from "@/app/page.module.css";

const businessSignals = [
  "Business profile",
  "Place scan",
  "Node agent",
  "AI2AI fit",
];

const accountSteps = [
  {
    label: "01",
    title: "Claim the business",
    body: "Start with owner/operator contact, business description, category, and place details.",
  },
  {
    label: "02",
    title: "Describe the fit",
    body: "Tell AVRAI who the business is for, what the desired vibe is, and what kind of customers should be promoted toward it.",
  },
  {
    label: "03",
    title: "Map the place",
    body: "Prepare a place scan and address boundary so the living map can understand the business as an entity, not just a listing.",
  },
  {
    label: "04",
    title: "Install the node",
    body: "Use the business node agent when the business is ready for always-on entity-level participation.",
  },
];

const governanceCards = [
  {
    label: "Registry",
    title: "Business profile and place claim",
    items: [
      "Business owner description becomes a claim for review.",
      "Place details prepare the registry for geohash boundary data.",
    ],
  },
  {
    label: "Forcefield",
    title: "Generalized AI2AI interaction only",
    items: [
      "Businesses see governed, generalized signals.",
      "No customer personal data is tracked through the business account.",
    ],
  },
  {
    label: "Actualizer",
    title: "Entity-level node direction",
    items: [
      "The business can become an entity in the hierarchy.",
      "QETS/DNA direction starts from strict seed intake and review.",
    ],
  },
];

export const metadata: Metadata = {
  title: "Business | AVRAI",
  description:
    "Start an AVRAI Business account for business profiles, place registry claims, governed AI2AI fit, and business node setup.",
};

export default function BusinessPage() {
  return (
    <SiteShell currentPath="/business" tone="business">
      <SitePageHero
        eyebrow="AVRAI Business"
        title="Create a business profile, map the place, and prepare an entity-level node."
        lede="AVRAI Business is the entry point for owner claims, place scans, business QETS/DNA direction, governed AI2AI fit, and the always-on business node agent."
        aside={
          <>
            <div className={styles.heroPanelHeader}>
              <p className={styles.sectionLabel}>Business account path</p>
              <p className={styles.panelCode}>claim / map / node / learn</p>
            </div>
            <p className={styles.heroPanelText}>
              Start with a business claim. Grow into a governed AVRAI entity.
            </p>
            <div className={styles.flowRail}>
              {businessSignals.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </>
        }
      />

      <section className={styles.journeySection}>
        <div className={styles.sectionIntro}>
          <p className={styles.sectionLabel}>Signup flow</p>
          <h2>Business accounts start as claims that AVRAI can verify.</h2>
          <p>
            The owner description is not just profile copy. It becomes the
            first direction for who the business should be promoted for and how
            its entity model should be weighted after review.
          </p>
        </div>

        <div className={styles.journeyRail}>
          {accountSteps.map((item) => (
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
          <p className={styles.sectionLabel}>Governed wiring</p>
          <h2>The business account connects to registry, forcefield, and hierarchy.</h2>
        </div>

        <div className={styles.surfaceGrid}>
          {governanceCards.map((item) => (
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

      <section className={styles.waitlistSection}>
        <div className={styles.waitlistIntro}>
          <p className={styles.sectionLabel}>Business signup</p>
          <h2>Start the business account intake.</h2>
          <p>
            Submit the business claim, place details, and audience direction.
            AVRAI will use this as the first reviewable seed for the account.
          </p>
        </div>
        <BusinessSignupForm />
      </section>
    </SiteShell>
  );
}
