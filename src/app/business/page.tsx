import type { Metadata } from "next";
import { BusinessSignupForm } from "@/components/business-signup-form";
import { SitePageHero, SiteShell } from "@/components/site-shell";
import styles from "@/app/page.module.css";

const businessSignals = [
  "Interest form",
  "Business app",
  "Node agent",
  "Pilot access",
];

const accountSteps = [
  {
    label: "01",
    title: "Submit interest",
    body: "Tell us who operates the business, where you are, and what kind of AVRAI Business access you want.",
  },
  {
    label: "02",
    title: "Request access",
    body: "Tell us whether you are interested in the Business App, the node agent, or pilot setup.",
  },
  {
    label: "03",
    title: "Wait for release",
    body: "No public app, node-agent, manifest, or installer files are available from the website right now.",
  },
  {
    label: "04",
    title: "Request pilot setup",
    body: "When the business is ready, AVRAI can configure account, node, and registry access through the app path.",
  },
];

export const metadata: Metadata = {
  title: "Business | AVRAI",
  description: "Submit AVRAI Business interest for future app access.",
};

export default function BusinessPage() {
  return (
    <SiteShell currentPath="/business" tone="business">
      <SitePageHero
        eyebrow="AVRAI Business"
        title="Tell us you are interested in AVRAI Business."
        lede="AVRAI Business is currently an interest path only. No public app, node-agent, manifest, or installer downloads are available from this website."
        aside={
          <>
            <div className={styles.heroPanelHeader}>
              <p className={styles.sectionLabel}>Business path</p>
              <p className={styles.panelCode}>interest / waitlist / pilot</p>
            </div>
            <p className={styles.heroPanelText}>
              The website only collects interest. App and node-agent access
              will be handled separately when a release is ready.
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
          <p className={styles.sectionLabel}>Current flow</p>
          <h2>The website is interest-only.</h2>
          <p>
            No public website submission creates a registry account, scans
            coordinates, writes live business records, or exposes downloadable
            files.
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
          <p className={styles.sectionLabel}>Availability</p>
          <h2>Nothing is available to download from the website right now.</h2>
          <p>
            Business App and node-agent access will come later through a
            controlled release path. The public website should not download or
            open any app, node-agent, manifest, installer, or service template.
          </p>
        </div>
      </section>

      <section className={styles.waitlistSection}>
        <div className={styles.waitlistIntro}>
          <p className={styles.sectionLabel}>Interest form</p>
          <h2>Tell us you want AVRAI Business.</h2>
          <p>
            This form only captures business interest and follow-up contact.
            It does not create a live business account or registry entry.
          </p>
        </div>
        <BusinessSignupForm />
      </section>
    </SiteShell>
  );
}
