"use client";

import { FormEvent, useState } from "react";
import styles from "@/app/page.module.css";

const interestOptions = [
  "Personal discovery and planning",
  "Local events and groups",
  "Business/operator access",
  "Venues and restaurants",
  "Community partnerships",
  "Agent/API integrations",
  "Press, research, or other",
];

export function WaitlistIntakeForm() {
  const [status, setStatus] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          interest: formData.get("interest"),
          _honey: formData.get("_honey"),
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(result?.message ?? "We couldn't send your request. Please try again.");
      }

      form.reset();
      setStatus({
        type: "success",
        message:
          "Request sent. We'll email you if there's a next step. Access is not confirmed yet.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We couldn't send your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-busy={isSubmitting}>
      <div className={styles.formGrid}>
        <label className={styles.honeypot} aria-hidden="true">
          <span>website</span>
          <input
            name="_honey"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>

        <label className={styles.field}>
          <span>Your name</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>

        <label className={styles.field}>
          <span>Email address</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>

        <label className={`${styles.field} ${styles.fieldWide}`}>
          <span>Company or organization (optional)</span>
          <input name="company" type="text" autoComplete="organization" />
        </label>

        <label className={`${styles.field} ${styles.fieldWide}`}>
          <span>What are you interested in?</span>
          <select name="interest" defaultValue={interestOptions[0]} required>
            {interestOptions.map((interest) => (
              <option key={interest} value={interest}>
                {interest}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        className={styles.formButton}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending request…" : "Request access"}
      </button>

      {status ? (
        <p
          className={`${styles.formStatus} ${
            status.type === "success"
              ? styles.formStatusSuccess
              : styles.formStatusError
          }`}
          role={status.type === "error" ? "alert" : "status"}
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
