import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const fallbackScriptUrl =
  "https://script.google.com/macros/s/AKfycbzY5rb-i9V860rdjj3DksliauBL33PS-DPt4qlgcK-iOpnk-mJyDHH1rXzggB9rQaYs/exec";

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
      { ok: false, message: "Submit the business interest form as JSON." },
      { status: 400 },
    );
  }

  if (cleanText(payload._honey, 120)) {
    return NextResponse.json({ ok: true, filtered: true }, { status: 202 });
  }

  const businessName = cleanText(payload.businessName, 180);
  const ownerName = cleanText(payload.ownerName, 180);
  const email = cleanText(payload.email, 320).toLowerCase();
  const city = cleanText(payload.city, 160);
  const businessType = cleanText(payload.businessType, 120);
  const accessInterest = cleanText(payload.accessInterest, 120);
  const notes = cleanText(payload.notes, 1800);

  if (!businessName || !ownerName || !email) {
    return NextResponse.json(
      {
        ok: false,
        message: "Business name, owner/operator, and email are required.",
      },
      { status: 400 },
    );
  }

  if (!isEmail(email)) {
    return NextResponse.json(
      { ok: false, message: "Enter a valid business contact email." },
      { status: 400 },
    );
  }

  const formBody = new URLSearchParams();
  formBody.set("name", ownerName || businessName);
  formBody.set("email", email);
  formBody.set("city", city);
  formBody.set("interest", "business-app-interest");
  formBody.set(
    "notes",
    [
      `Business: ${businessName}`,
      `Business type: ${businessType}`,
      `Access interest: ${accessInterest}`,
      `Notes: ${notes}`,
    ].join("\n"),
  );
  formBody.set("source", "avrai.org/business");
  formBody.set("submittedAt", new Date().toISOString());

  const target =
    process.env.BUSINESS_INTEREST_WEBHOOK_URL ??
    process.env.NEXT_PUBLIC_WAITLIST_SCRIPT_URL ??
    fallbackScriptUrl;

  try {
    const response = await fetch(target, {
      method: "POST",
      body: formBody,
    });

    if (!response.ok && response.type !== "opaque") {
      throw new Error(`interest endpoint returned ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Business interest could not be submitted. Email reis@avrai.org and we will add it manually.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
