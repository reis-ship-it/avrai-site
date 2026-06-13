import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { contactEmails } from "@/components/site-content";
import styles from "@/app/page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Email AVRAI for business, support, privacy, legal, partnerships, press, billing, and careers.",
};

export default function ContactPage() {
  return (
    <SiteShell currentPath="/contact" tone="contact">
      <section className={styles.contactIntro}>
        <h1>send us a message, we will respond ASAP</h1>
      </section>

      <section className={styles.emailGrid} aria-label="AVRAI email addresses">
        {contactEmails.map((item) => (
          <a
            className={styles.emailCard}
            href={`mailto:${item.email}`}
            key={item.email}
          >
            <strong>{item.email}</strong>
          </a>
        ))}
      </section>
    </SiteShell>
  );
}
