"use client";

import { FormEvent, useState } from "react";
import styles from "@/app/page.module.css";

type Status = "idle" | "submitting" | "success" | "error";

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

    try {
      const response = await fetch("/api/business-interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName: field(formData, "businessName"),
          ownerName: field(formData, "ownerName"),
          email: field(formData, "email"),
          city: field(formData, "city"),
          businessType: field(formData, "businessType"),
          accessInterest: field(formData, "accessInterest"),
          notes: field(formData, "notes"),
          _honey: field(formData, "_honey"),
        }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.ok) {
        throw new Error(result?.message ?? "Business interest was not saved.");
      }

      setStatus("success");
      setMessage("Business interest received. We will follow up by email.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Submission failed. Email reis@avrai.org and we will add it manually.",
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
          <span>Business type</span>
          <select name="businessType" defaultValue="venue">
            <option value="venue">Venue, cafe, bar, or restaurant</option>
            <option value="retail">Retail or local service</option>
            <option value="studio">Studio, creator, or community space</option>
            <option value="operator">Operator or multi-location group</option>
            <option value="other">Other business</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>Access interest</span>
          <select name="accessInterest" defaultValue="business-app">
            <option value="business-app">Business app</option>
            <option value="node-agent">Always-on node agent</option>
            <option value="both">Business app and node agent</option>
            <option value="pilot">Pilot access</option>
          </select>
        </label>
      </div>

      <label className={styles.field}>
        <span>What do you want to use it for?</span>
        <textarea
          name="notes"
          rows={5}
          placeholder="Tell us what kind of business you run, what device you want to install on, and what you want AVRAI Business to help with."
        />
      </label>

      <div className={styles.formActions}>
        <button
          className={styles.formButton}
          type="submit"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Submitting..." : "Submit interest"}
        </button>
        <p className={styles.formNote}>
          This is an interest form only. It does not create a business account,
          scan coordinates, or write to the AVRAI registry.
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
