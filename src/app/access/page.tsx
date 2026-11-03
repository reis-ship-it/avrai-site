import type { Metadata } from "next";
import Link from "next/link";
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
          <p className={styles.eyebrow}>Early access</p>
          <h1 id="access-title">Request access to AVRAI.</h1>
          <p>
            Tell us how to reach you and what you’re interested in. We’ll email
            you if there’s a relevant opportunity to try AVRAI.
          </p>
          <Link className={styles.backLink} href="/">
            <span aria-hidden="true">←</span> Back to AVRAI
          </Link>
        </div>

        <div className={styles.formPanel}>
          <h2>Join the access list</h2>
          <p>
            This is a request to hear about access. It does not create an
            account or provide immediate access.
          </p>
          <WaitlistIntakeForm />
          <p className={styles.formNote}>
            We use the details you provide to review your request and contact
            you about AVRAI access.
          </p>
          <div className={styles.businessNote}>
            <span>Looking for business access?</span>
            <a href="https://business.avrai.org/signup">
              Create a business account <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
