import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const fallbackScriptUrl =
  "https://script.google.com/macros/s/AKfycbzY5rb-i9V860rdjj3DksliauBL33PS-DPt4qlgcK-iOpnk-mJyDHH1rXzggB9rQaYs/exec";

const allowedInterests = new Set([
  "Personal discovery and planning",
  "Local events and groups",
  "Business/operator access",
  "Venues and restaurants",
  "Community partnerships",
  "Agent/API integrations",
  "Press, research, or other",
]);

function cleanText(value: unknown, maxLength = 1000) {
  return typeof value === "string"
    ? value.replace(/\s+/g, " ").trim().slice(0, maxLength)
    : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload !== "object") {
    return NextResponse.json(
      { ok: false, message: "Submit the waitlist form as JSON." },
      { status: 400 },
    );
  }

  const fields = payload as Record<string, unknown>;

  if (cleanText(fields._honey, 120)) {
    return NextResponse.json({ ok: true, filtered: true }, { status: 202 });
  }

  const name = cleanText(fields.name, 180);
  const email = cleanText(fields.email, 320).toLowerCase();
  const company = cleanText(fields.company, 180);
  const interest = cleanText(fields.interest, 180);

  if (!name || !email) {
    return NextResponse.json(
      { ok: false, message: "Name and email are required." },
      { status: 400 },
    );
  }

  if (!isEmail(email)) {
    return NextResponse.json(
      { ok: false, message: "Enter a valid email address." },
      { status: 400 },
    );
  }

  if (!allowedInterests.has(interest)) {
    return NextResponse.json(
      { ok: false, message: "Choose a waitlist interest." },
      { status: 400 },
    );
  }

  const formBody = new URLSearchParams();
  formBody.set("name", name);
  formBody.set("email", email);
  formBody.set("company", company);
  formBody.set("interest", interest);
  formBody.set("notes", company ? `Company: ${company}` : "");
  formBody.set("source", "avrai.org");
  formBody.set("submittedAt", new Date().toISOString());

  const target =
    process.env.WAITLIST_WEBHOOK_URL ??
    process.env.NEXT_PUBLIC_WAITLIST_SCRIPT_URL ??
    fallbackScriptUrl;

  try {
    const response = await fetch(target, {
      method: "POST",
      body: formBody,
    });

    if (!response.ok && response.type !== "opaque") {
      throw new Error(`waitlist endpoint returned ${response.status}`);
    }
  } catch (error) {
    console.error("waitlist submission failed", error);

    return NextResponse.json(
      {
        ok: false,
        message:
          "Waitlist signup could not be submitted. Email info@avrai.org and we will add it manually.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
