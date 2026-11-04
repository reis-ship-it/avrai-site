import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { WaitlistIntakeForm } from "@/components/waitlist-intake-form";
import styles from "@/app/page.module.css";

export const metadata: Metadata = {
  title: "Request access",
  description:
    "Request early access to AVRAI and tell us what you are interested in.",
  alternates: { canonical: "/access" },
};

export default function AccessPage() {
  return (
    <SiteShell currentPath="/access">
      <section className={styles.accessPage} aria-labelledby="access-title">
        <div className={styles.accessIntro}>
          <p className={styles.eyebrow}>EARLY ACCESS</p>
          <h1 id="access-title">Request access.</h1>
          <p>
            Tell us how to reach you and what you’re interested in. We’ll email
            you if there’s a relevant opportunity to try AVRAI.
          </p>
        </div>

        <div className={styles.formPanel}>
          <WaitlistIntakeForm />
          <p className={styles.formNote}>
            Submitting this form does not create an account or guarantee access.
            We use these details to follow up about AVRAI.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
