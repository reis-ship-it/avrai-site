"use client";

import { FormEvent, useState } from "react";
import styles from "@/app/page.module.css";

type Status = "idle" | "submitting" | "success" | "error";

export function WaitlistForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (String(formData.get("_honey") ?? "").trim() !== "") {
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("https://formsubmit.co/ajax/reis@avrai.org", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      setMessage("You’re on the list. We’ll reach out when early access opens.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage(
        "The form did not go through. Email reis@avrai.org and we’ll add you manually.",
      );
    }
  }

  return (
    <form className={styles.waitlistForm} onSubmit={handleSubmit}>
      <input type="hidden" name="_subject" value="New AVRAI waitlist signup" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input
        className={styles.honeypot}
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span>Name</span>
          <input type="text" name="name" placeholder="Your name" required />
        </label>

        <label className={styles.field}>
          <span>Email</span>
          <input
            type="email"
            name="email"
            placeholder="you@domain.com"
            required
          />
        </label>

        <label className={styles.field}>
          <span>City</span>
          <input type="text" name="city" placeholder="Brooklyn, New York" />
        </label>

        <label className={styles.field}>
          <span>I’m interested in</span>
          <select name="interest" defaultValue="consumer">
            <option value="consumer">Using the app</option>
            <option value="host">Hosting events</option>
            <option value="business">Bringing Avrai to a place or business</option>
            <option value="partner">Partnerships</option>
          </select>
        </label>
      </div>

      <label className={styles.field}>
        <span>What do you want Avrai to help with?</span>
        <textarea
          name="notes"
          rows={4}
          placeholder="Finding better places, planning with friends, hosting events, bringing people into a space..."
        />
      </label>

      <div className={styles.formActions}>
        <button
          className={styles.formButton}
          type="submit"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Submitting..." : "Join the waitlist"}
        </button>
        <p className={styles.formNote}>
          Waitlist requests go directly to the Avrai team.
        </p>
      </div>

      {message ? (
        <p
          className={
            status === "success" ? styles.formSuccess : styles.formError
          }
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
