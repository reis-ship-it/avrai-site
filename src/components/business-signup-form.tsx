"use client";

import { FormEvent, useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import styles from "@/app/page.module.css";

type Status = "idle" | "submitting" | "success" | "error";
type GeoStatus = "idle" | "capturing" | "ready" | "error";
type BoundaryPoint = {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  capturedAt: string;
};

function field(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function formatPoint(point: BoundaryPoint) {
  return `${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}`;
}

export function BusinessSignupForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [message, setMessage] = useState("");
  const [geoMessage, setGeoMessage] = useState("");
  const [boundaryPoints, setBoundaryPoints] = useState<BoundaryPoint[]>([]);
  const [scanSessionId, setScanSessionId] = useState("");
  const [scanUrl, setScanUrl] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session =
      params.get("scanSession") ??
      window.crypto?.randomUUID?.() ??
      String(Date.now());

    setScanSessionId(session);
    setScanUrl(
      `${window.location.origin}/business?scan=1&scanSession=${encodeURIComponent(
        session,
      )}`,
    );
  }, []);

  function captureBoundaryPoint() {
    if (!("geolocation" in navigator)) {
      setGeoStatus("error");
      setGeoMessage("This browser cannot capture location points.");
      return;
    }

    setGeoStatus("capturing");
    setGeoMessage("Capturing current place point...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const point: BoundaryPoint = {
          latitude: Number(position.coords.latitude.toFixed(7)),
          longitude: Number(position.coords.longitude.toFixed(7)),
          accuracyMeters: Number(position.coords.accuracy.toFixed(1)),
          capturedAt: new Date().toISOString(),
        };

        setBoundaryPoints((current) => [...current, point].slice(-80));
        setGeoStatus("ready");
        setGeoMessage(
          `Added point ${formatPoint(point)} with about ${Math.round(
            point.accuracyMeters ?? 0,
          )}m accuracy.`,
        );
      },
      (error) => {
        setGeoStatus("error");
        setGeoMessage(
          error.message || "Location capture failed. Check browser permission.",
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 18000,
      },
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (field(formData, "_honey") !== "") {
      return;
    }

    setStatus("submitting");
    setMessage("");

    const businessName = field(formData, "businessName");
    const ownerName = field(formData, "ownerName");
    const email = field(formData, "email");
    const phone = field(formData, "phone");
    const website = field(formData, "website");
    const city = field(formData, "city");
    const address = field(formData, "address");
    const category = field(formData, "category");
    const description = field(formData, "description");
    const vibe = field(formData, "vibe");
    const nodeInterest = field(formData, "nodeInterest");
    const notes = field(formData, "notes");

    try {
      const response = await fetch("/api/business-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName,
          ownerName,
          email,
          phone,
          website,
          city,
          address,
          category,
          description,
          vibe,
          nodeInterest,
          notes,
          boundaryPoints,
          scanSessionId,
          submittedFrom: window.location.href,
          _honey: field(formData, "_honey"),
        }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.ok) {
        throw new Error(
          result?.message ??
            "The business registry did not accept this submission.",
        );
      }

      setStatus("success");
      setMessage(
        `Saved to Supabase registry. Business ${result.businessId} created, BHAM seed ${result.seedClaimId} queued${
          result.centroidGeohash
            ? `, and place geohash ${result.centroidGeohash} projected.`
            : ". Add a QR place scan later to project exact coordinates."
        }`,
      );
      form.reset();
      setBoundaryPoints([]);
      setGeoStatus("idle");
      setGeoMessage("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Submission failed. Email reis@avrai.org and we will add the business manually.",
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
          <span>Phone</span>
          <input type="tel" name="phone" placeholder="Business phone" />
        </label>

        <label className={styles.field}>
          <span>Website</span>
          <input type="url" name="website" placeholder="https://business.com" />
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
        <span>Describe this business</span>
        <textarea
          name="description"
          rows={4}
          placeholder="Example: an independent cafe with late-afternoon study tables, local art, and small evening events."
          required
        />
      </label>

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

      <section className={styles.placeScanPanel}>
        <div className={styles.placeScanCopy}>
          <p className={styles.cardLabel}>QR place scan</p>
          <h3>Save exact business geohash data.</h3>
          <p>
            Open this intake on a phone, stand at entrances, corners, or key
            interior zones, then add points before submitting. This stores place
            geometry only, not customer identity or personal movement.
          </p>
        </div>

        <div className={styles.placeScanQr}>
          {scanUrl ? (
            <QRCodeCanvas
              value={scanUrl}
              size={156}
              marginSize={2}
              bgColor="#ffffff"
              fgColor="#101b2d"
              title="Open AVRAI business place scan"
            />
          ) : null}
          <p>Scan on mobile</p>
        </div>

        <div className={styles.placeScanActions}>
          <button
            className={styles.formButton}
            type="button"
            onClick={captureBoundaryPoint}
            disabled={geoStatus === "capturing"}
          >
            {geoStatus === "capturing" ? "Capturing..." : "Add current point"}
          </button>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() => {
              setBoundaryPoints([]);
              setGeoStatus("idle");
              setGeoMessage("");
            }}
            disabled={boundaryPoints.length === 0}
          >
            Clear points
          </button>
        </div>

        <p
          className={
            geoStatus === "error" ? styles.formError : styles.formNote
          }
        >
          {geoMessage ||
            `${boundaryPoints.length} place point${
              boundaryPoints.length === 1 ? "" : "s"
            } captured for this submission.`}
        </p>

        {boundaryPoints.length > 0 ? (
          <ol className={styles.boundaryList}>
            {boundaryPoints.slice(-5).map((point) => (
              <li key={`${point.capturedAt}-${point.latitude}`}>
                <span>{formatPoint(point)}</span>
                <small>
                  {point.accuracyMeters
                    ? `accuracy ${Math.round(point.accuracyMeters)}m`
                    : "accuracy unknown"}
                </small>
              </li>
            ))}
          </ol>
        ) : null}
      </section>

      <div className={styles.formActions}>
        <button
          className={styles.formButton}
          type="submit"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Submitting..." : "Start business signup"}
        </button>
        <p className={styles.formNote}>
          This now writes to the AVRAI Supabase registry. It captures business
          contact and place-geometry claims only; no customer personal data is
          collected through this form.
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
