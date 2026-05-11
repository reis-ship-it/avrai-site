"use client";

import { FormEvent, useState } from "react";
import styles from "@/app/page.module.css";

type Status = "idle" | "submitting" | "success" | "error";
const scriptUrl =
  process.env.NEXT_PUBLIC_WAITLIST_SCRIPT_URL ??
  "https://script.google.com/macros/s/AKfycbzY5rb-i9V860rdjj3DksliauBL33PS-DPt4qlgcK-iOpnk-mJyDHH1rXzggB9rQaYs/exec";

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

    if (!scriptUrl) {
      setStatus("error");
      setMessage(
        "Waitlist intake is not configured yet. Email reis@avrai.org and we’ll add you manually.",
      );
      return;
    }

    try {
      const payload = new URLSearchParams();
      payload.set("name", String(formData.get("name") ?? ""));
      payload.set("email", String(formData.get("email") ?? ""));
      payload.set("city", String(formData.get("city") ?? ""));
      payload.set("interest", String(formData.get("interest") ?? ""));
      payload.set("notes", String(formData.get("notes") ?? ""));
      payload.set("source", "avrai.org");
      payload.set("submittedAt", new Date().toISOString());
      payload.set("userAgent", window.navigator.userAgent);
      payload.set("_honey", String(formData.get("_honey") ?? ""));

      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        body: payload,
      });

      setStatus("success");
      setMessage("Request received. We’ll follow up as early access opens.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage(
        "Submission failed. Email reis@avrai.org and we’ll add you manually.",
      );
    }
  }

  return (
    <form className={styles.waitlistForm} onSubmit={handleSubmit}>
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
          <input type="text" name="city" placeholder="New York, NY" />
        </label>

        <label className={styles.field}>
          <span>Interest</span>
          <select name="interest" defaultValue="consumer">
            <option value="consumer">Early product access</option>
            <option value="host">Hosting or venue operations</option>
            <option value="business">Business or enterprise deployment</option>
            <option value="partner">Research or partnership</option>
          </select>
        </label>
      </div>

      <label className={styles.field}>
        <span>What are you evaluating?</span>
        <textarea
          name="notes"
          rows={4}
          placeholder="Place discovery, group planning, venue workflows, partnerships, research collaboration, or something else."
        />
      </label>

      <div className={styles.formActions}>
        <button
          className={styles.formButton}
          type="submit"
          disabled={status === "submitting" || !scriptUrl}
        >
          {status === "submitting" ? "Submitting..." : "Join the waitlist"}
        </button>
        <p className={styles.formNote}>
          Requests are routed to AVRAI’s private intake sheet.
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
