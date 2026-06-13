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
        throw new Error(result?.message ?? "Waitlist signup failed.");
      }

      form.reset();
      setStatus({
        type: "success",
        message: "you are on the waitlist",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Waitlist signup failed.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.waitlistForm} onSubmit={handleSubmit}>
      <label className={styles.honeypot} aria-hidden="true">
        <span>website</span>
        <input
          name="_honey"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      <label>
        <span>name</span>
        <input name="name" type="text" autoComplete="name" required />
      </label>

      <label>
        <span>email</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>

      <label>
        <span>company</span>
        <input name="company" type="text" autoComplete="organization" />
      </label>

      <label className={styles.interestField}>
        <span>interest</span>
        <span className={styles.waitlistSelectWrap}>
          <select name="interest" defaultValue={interestOptions[0]} required>
            {interestOptions.map((interest) => (
              <option key={interest} value={interest}>
                {interest}
              </option>
            ))}
          </select>
        </span>
      </label>

      <button
        className={styles.waitlistSubmit}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "joining" : "join"}
      </button>

      {status ? (
        <p
          className={`${styles.formStatus} ${
            status.type === "success"
              ? styles.formStatusSuccess
              : styles.formStatusError
          }`}
          aria-live="polite"
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
