"use client";

import { FormEvent, useState } from "react";
import styles from "@/app/page.module.css";

type Status = "idle" | "submitting" | "success" | "error";

const scriptUrl =
  process.env.NEXT_PUBLIC_WAITLIST_SCRIPT_URL ??
  "https://script.google.com/macros/s/AKfycbzY5rb-i9V860rdjj3DksliauBL33PS-DPt4qlgcK-iOpnk-mJyDHH1rXzggB9rQaYs/exec";

function field(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function BusinessSignupForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (field(formData, "_honey") !== "") {
      return;
    }

    setStatus("submitting");
    setMessage("");

    if (!scriptUrl) {
      setStatus("error");
      setMessage(
        "Business intake is not configured yet. Email reis@avrai.org and we will add the business manually.",
      );
      return;
    }

    const businessName = field(formData, "businessName");
    const ownerName = field(formData, "ownerName");
    const email = field(formData, "email");
    const city = field(formData, "city");
    const address = field(formData, "address");
    const category = field(formData, "category");
    const vibe = field(formData, "vibe");
    const nodeInterest = field(formData, "nodeInterest");
    const notes = field(formData, "notes");

    try {
      const payload = new URLSearchParams();
      payload.set("name", ownerName || businessName);
      payload.set("email", email);
      payload.set("city", city);
      payload.set("interest", "business-account");
      payload.set(
        "notes",
        [
          `Business: ${businessName}`,
          `Address or area: ${address}`,
          `Category: ${category}`,
          `Desired vibe / customer direction: ${vibe}`,
          `Node interest: ${nodeInterest}`,
          `Notes: ${notes}`,
        ].join("\n"),
      );
      payload.set("source", "avrai.org/business");
      payload.set("submittedAt", new Date().toISOString());
      payload.set("userAgent", window.navigator.userAgent);
      payload.set("_honey", field(formData, "_honey"));

      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        body: payload,
      });

      setStatus("success");
      setMessage(
        "Business signup received. We will follow up with the next account step.",
      );
      form.reset();
    } catch {
      setStatus("error");
      setMessage(
        "Submission failed. Email reis@avrai.org and we will add the business manually.",
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
          <span>Business name</span>
          <input
            type="text"
            name="businessName"
            placeholder="Business or venue"
            required
          />
        </label>

        <label className={styles.field}>
          <span>Owner or operator</span>
          <input
            type="text"
            name="ownerName"
            placeholder="Your name"
            required
          />
        </label>

        <label className={styles.field}>
          <span>Email</span>
          <input
            type="email"
            name="email"
            placeholder="owner@business.com"
            required
          />
        </label>

        <label className={styles.field}>
          <span>City</span>
          <input type="text" name="city" placeholder="Birmingham, AL" />
        </label>

        <label className={styles.field}>
          <span>Address or area</span>
          <input
            type="text"
            name="address"
            placeholder="Street address or neighborhood"
          />
        </label>

        <label className={styles.field}>
          <span>Business type</span>
          <select name="category" defaultValue="venue">
            <option value="venue">Venue, cafe, bar, or restaurant</option>
            <option value="retail">Retail or local service</option>
            <option value="studio">Studio, creator, or community space</option>
            <option value="operator">Operator or multi-location group</option>
            <option value="other">Other business</option>
          </select>
        </label>
      </div>

      <label className={styles.field}>
        <span>Who should AVRAI learn to promote you for?</span>
        <textarea
          name="vibe"
          rows={4}
          placeholder="Example: a quiet cafe for students, artists, and remote workers who want focused afternoons."
          required
        />
      </label>

      <label className={styles.field}>
        <span>Node interest</span>
        <select name="nodeInterest" defaultValue="business-account">
          <option value="business-account">Business account first</option>
          <option value="place-scan">Map/place scan first</option>
          <option value="node-agent">Always-on business node agent</option>
          <option value="pilot">Pilot or operator workflow</option>
        </select>
      </label>

      <label className={styles.field}>
        <span>Anything else we should know?</span>
        <textarea
          name="notes"
          rows={4}
          placeholder="Current tools, reservation flow, events, ideal customers, or operating constraints."
        />
      </label>

      <div className={styles.formActions}>
        <button
          className={styles.formButton}
          type="submit"
          disabled={status === "submitting" || !scriptUrl}
        >
          {status === "submitting" ? "Submitting..." : "Start business signup"}
        </button>
        <p className={styles.formNote}>
          This intake captures business contact details only. AVRAI does not
          collect customer personal data through this form.
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
