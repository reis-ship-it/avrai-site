import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type BoundaryPointInput = {
  latitude?: unknown;
  lat?: unknown;
  longitude?: unknown;
  lng?: unknown;
  accuracyMeters?: unknown;
  accuracy?: unknown;
  capturedAt?: unknown;
};

type BusinessSignupPayload = {
  businessName?: unknown;
  ownerName?: unknown;
  email?: unknown;
  phone?: unknown;
  website?: unknown;
  city?: unknown;
  address?: unknown;
  category?: unknown;
  description?: unknown;
  vibe?: unknown;
  nodeInterest?: unknown;
  notes?: unknown;
  boundaryPoints?: unknown;
  scanSessionId?: unknown;
  submittedFrom?: unknown;
  _honey?: unknown;
};

type BoundaryPoint = {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  capturedAt: string;
};

type SupabaseConfig = {
  url: string;
  serviceRoleKey: string;
};

const GEOHASH_BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";
const STOP_WORDS = new Set([
  "about",
  "after",
  "also",
  "and",
  "are",
  "but",
  "for",
  "from",
  "have",
  "into",
  "like",
  "near",
  "not",
  "our",
  "that",
  "the",
  "their",
  "this",
  "through",
  "want",
  "when",
  "where",
  "with",
  "who",
  "will",
  "you",
  "your",
]);

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function normalizeUrl(value: string) {
  if (!value) {
    return "";
  }

  try {
    const parsed = new URL(value.startsWith("http") ? value : `https://${value}`);
    return parsed.toString().slice(0, 320);
  } catch {
    return "";
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function slugify(value: string, fallback: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

  return slug || fallback;
}

function shortHash(value: string, length = 12) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, length);
}

function encodeGeohash(latitude: number, longitude: number, precision = 10) {
  let idx = 0;
  let bit = 0;
  let evenBit = true;
  let geohash = "";
  let latMin = -90;
  let latMax = 90;
  let lonMin = -180;
  let lonMax = 180;

  while (geohash.length < precision) {
    if (evenBit) {
      const lonMid = (lonMin + lonMax) / 2;
      if (longitude >= lonMid) {
        idx = idx * 2 + 1;
        lonMin = lonMid;
      } else {
        idx *= 2;
        lonMax = lonMid;
      }
    } else {
      const latMid = (latMin + latMax) / 2;
      if (latitude >= latMid) {
        idx = idx * 2 + 1;
        latMin = latMid;
      } else {
        idx *= 2;
        latMax = latMid;
      }
    }

    evenBit = !evenBit;

    if (++bit === 5) {
      geohash += GEOHASH_BASE32.charAt(idx);
      bit = 0;
      idx = 0;
    }
  }

  return geohash;
}

function numberFrom(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function sanitizeBoundaryPoints(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  const points: BoundaryPoint[] = [];

  for (const raw of value.slice(0, 80) as BoundaryPointInput[]) {
    const latitude = numberFrom(raw.latitude ?? raw.lat);
    const longitude = numberFrom(raw.longitude ?? raw.lng);

    if (
      latitude === undefined ||
      longitude === undefined ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      continue;
    }

    const accuracy = numberFrom(raw.accuracyMeters ?? raw.accuracy);
    const capturedAt =
      typeof raw.capturedAt === "string" && !Number.isNaN(Date.parse(raw.capturedAt))
        ? new Date(raw.capturedAt).toISOString()
        : new Date().toISOString();

    points.push({
      latitude: Number(latitude.toFixed(7)),
      longitude: Number(longitude.toFixed(7)),
      accuracyMeters:
        accuracy !== undefined && accuracy >= 0 && accuracy <= 10000
          ? Number(accuracy.toFixed(1))
          : undefined,
      capturedAt,
    });
  }

  return points;
}

function centroid(points: BoundaryPoint[]) {
  if (points.length === 0) {
    return undefined;
  }

  const sums = points.reduce(
    (acc, point) => ({
      latitude: acc.latitude + point.latitude,
      longitude: acc.longitude + point.longitude,
    }),
    { latitude: 0, longitude: 0 },
  );

  return {
    latitude: Number((sums.latitude / points.length).toFixed(7)),
    longitude: Number((sums.longitude / points.length).toFixed(7)),
  };
}

function tokenize(...values: string[]) {
  const counts = new Map<string, number>();

  for (const value of values) {
    const words = value
      .toLowerCase()
      .match(/[a-z0-9][a-z0-9-]{2,}/g);

    for (const word of words ?? []) {
      if (STOP_WORDS.has(word)) {
        continue;
      }
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 32);
}

function tokenVector(prefix: string, ...values: string[]) {
  const entries = tokenize(...values);
  const total = entries.reduce((sum, [, count]) => sum + count, 0) || 1;

  return Object.fromEntries(
    entries.map(([token, count]) => [
      `${prefix}.${token}`,
      Number((count / total).toFixed(4)),
    ]),
  );
}

function getSupabaseConfig(): SupabaseConfig | undefined {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return undefined;
  }

  return { url: url.replace(/\/+$/, ""), serviceRoleKey };
}

async function upsertSupabaseRow<T extends Record<string, unknown>>({
  config,
  schema = "public",
  table,
  onConflict,
  row,
}: {
  config: SupabaseConfig;
  schema?: "public" | "api";
  table: string;
  onConflict: string;
  row: T;
}) {
  const url = new URL(`${config.url}/rest/v1/${table}`);
  url.searchParams.set("on_conflict", onConflict);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
      ...(schema === "api"
        ? {
            "Accept-Profile": "api",
            "Content-Profile": "api",
          }
        : {}),
    },
    body: JSON.stringify(row),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `${schema}.${table} upsert failed (${response.status}): ${body.slice(0, 500)}`,
    );
  }

  return response.json().catch(() => undefined);
}

function publicError(message: string, status: number, code: string) {
  return NextResponse.json(
    {
      ok: false,
      code,
      message,
    },
    { status },
  );
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    accepts: "POST",
    registryConfigured: Boolean(getSupabaseConfig()),
    registryTargets: [
      "public.business_accounts",
      "public.business_bham_registry_seed_claims",
      "public.business_qets_dna_labels",
      "public.place_scan_claims",
      "api.spots",
    ],
  });
}

export async function POST(request: NextRequest) {
  let payload: BusinessSignupPayload;

  try {
    payload = await request.json();
  } catch {
    return publicError("Business intake must be submitted as JSON.", 400, "invalid_json");
  }

  if (cleanText(payload._honey, 120)) {
    return NextResponse.json({ ok: true, filtered: true }, { status: 202 });
  }

  const config = getSupabaseConfig();
  if (!config) {
    return publicError(
      "Supabase registry is not configured for the business site yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to the deployment environment.",
      503,
      "supabase_registry_not_configured",
    );
  }

  const businessName = cleanText(payload.businessName, 160);
  const ownerName = cleanText(payload.ownerName, 160);
  const email = cleanText(payload.email, 320).toLowerCase();
  const phone = cleanText(payload.phone, 60);
  const website = normalizeUrl(cleanText(payload.website, 320));
  const city = cleanText(payload.city, 160);
  const address = cleanText(payload.address, 260);
  const category = cleanText(payload.category, 80) || "other";
  const description = cleanText(payload.description, 1200);
  const vibe = cleanText(payload.vibe, 1400);
  const nodeInterest = cleanText(payload.nodeInterest, 100) || "business-account";
  const notes = cleanText(payload.notes, 1400);
  const scanSessionId = cleanText(payload.scanSessionId, 120);
  const submittedFrom = cleanText(payload.submittedFrom, 500);
  const boundaryPoints = sanitizeBoundaryPoints(payload.boundaryPoints);
  const center = centroid(boundaryPoints);
  const now = new Date().toISOString();

  if (!businessName || !ownerName || !email || !description || !vibe) {
    return publicError(
      "Business name, owner/operator, email, business description, and promotion direction are required.",
      400,
      "missing_required_fields",
    );
  }

  if (!isValidEmail(email)) {
    return publicError("Enter a valid business contact email.", 400, "invalid_email");
  }

  const businessId = crypto.randomUUID();
  const targetSpotId = center ? crypto.randomUUID() : undefined;
  const seedHash = shortHash(`${businessId}:${businessName}:${email}:${now}`);
  const businessSlug = slugify(businessName, "business");
  const claimId = `business-bham-seed-${seedHash}`;
  const qetsLabelId = `business-qets-dna-${seedHash}`;
  const placeScanClaimId = center ? `place-scan-${seedHash}` : undefined;
  const candidateId = `bham-business-${businessSlug}-${shortHash(businessId, 8)}`;
  const forcefieldReceiptId = `forcefield-business-intake-${seedHash}`;
  const centroidGeohash = center
    ? encodeGeohash(center.latitude, center.longitude, 10)
    : undefined;
  const coveringGeohashes = center
    ? [
        centroidGeohash,
        ...boundaryPoints.map((point) =>
          encodeGeohash(point.latitude, point.longitude, 10),
        ),
      ].filter((value, index, all): value is string => Boolean(value) && all.indexOf(value) === index)
    : [];
  const location = [address, city].filter(Boolean).join(", ");
  const categoryRefs = [`business_category:${slugify(category, "other")}`];
  const localityRef = city ? `locality:${slugify(city, "unknown")}` : undefined;
  const audienceRefs = tokenize(vibe, description, notes)
    .slice(0, 12)
    .map(([token]) => `owner_claim_audience:${token}`);
  const sourceRefs = [
    `business_seed_claim:${businessId}`,
    `forcefield:${forcefieldReceiptId}`,
    "website:avrai.org/business",
  ];

  const claimedAudienceVector = tokenVector("audience", vibe, notes);
  const claimedEntityDnaVector = tokenVector(
    "entity_dna_claim",
    businessName,
    category,
    description,
    vibe,
  );
  const claimedEntityQetsVector = {
    ...tokenVector("entity_qets_claim", description, vibe),
    "qets.claim_owner_direction_present": 1,
    "qets.exact_place_scan_present": center ? 1 : 0,
  };
  const claimedNodeModelWeightVector = {
    "node.claim_owner_description": 1,
    "node.claim_promotion_direction": 1,
    "node.exact_place_geometry": center ? 1 : 0,
    "node.always_on_interest": nodeInterest === "node-agent" ? 1 : 0,
    "node.registry_review_required": 1,
  };

  const businessAccount = {
    id: businessId,
    name: businessName,
    email,
    description,
    website: website || null,
    location: location || null,
    phone: phone || null,
    business_type: category,
    categories: categoryRefs,
    verification: {
      status: "pending",
      source: "avrai.org/business",
      submittedAt: now,
      strictBhamSeedIntakeRequired: true,
      forcefieldReceiptId,
      seedClaimId: claimId,
      placeScanClaimId: placeScanClaimId ?? null,
      targetSpotId: targetSpotId ?? null,
    },
    members: [
      {
        role: "owner_operator",
        name: ownerName,
        email,
        status: "submitted",
        submittedAt: now,
      },
    ],
    attraction_dimensions: {
      source: "avrai.org/business",
      ownerDescriptionClaim: description,
      ownerDesiredVibeClaim: vibe,
      ownerPromotionDirectionClaim: vibe,
      nodeInterest,
      notes,
      scanSessionId: scanSessionId || null,
      traceableHumanPersonalDataAllowed: false,
      containsCustomerPersonalData: false,
      canonicalQetsDnaLabelAuthority: false,
      strictBhamPromotionRequired: true,
      exactPlaceScanPresent: Boolean(center),
      centroidGeohash: centroidGeohash ?? null,
    },
    has_login_credentials: false,
    is_active: true,
    is_verified: false,
    updated_at: now,
  };

  const boundedMetadata = {
    schemaVersion: "business_bham_seed_claim_v1",
    claimLayer: "owner_described_business_claim",
    claimAuthority: "business_owner_submitted_claim_pending_review",
    ownerDescriptionIsClaimOnly: true,
    ownerDesiredVibeIsClaimOnly: true,
    ownerPromotionDirectionIsClaimOnly: true,
    promotionAudienceRequiresVerification: true,
    nodeModelWeightsAreClaimHints: true,
    nodeModelWeightsRequireBhamReview: true,
    canonicalQetsDnaLabelAuthority: false,
    strictBhamPromotionRequired: true,
    sameRegistryPathAsUserAppAfterPromotion: true,
    businessAppSelfAssignedLabel: false,
    userAppStateCopied: false,
    traceableHumanPersonalDataAllowed: false,
    claimCannotTargetTraceableHumans: true,
    privacyProtectedAudienceOnly: true,
    containsCustomerPersonalData: false,
    placeExactGeohashPresent: Boolean(center),
    publicScannerHumanIdentitySharedWithBusiness: false,
    source: "avrai.org/business",
    submittedFrom,
    scanSessionId: scanSessionId || null,
  };

  const seedClaim = {
    claim_id: claimId,
    business_id: businessId,
    registry_id: "bham_registry_seed",
    candidate_id: candidateId,
    display_label: businessName,
    status: center ? "forcefieldAccepted" : "needsReview",
    forcefield_receipt_id: forcefieldReceiptId,
    submitted_at: now,
    place_ref: placeScanClaimId ?? null,
    target_spot_id: targetSpotId ?? null,
    centroid_geohash: centroidGeohash ?? null,
    covering_geohashes: coveringGeohashes,
    locality_ref: localityRef ?? null,
    category_refs: categoryRefs,
    source_refs: sourceRefs,
    owner_business_type_claim: category,
    owner_description_claim: description,
    owner_desired_vibe_claim: vibe,
    claimed_promotion_audience_refs: audienceRefs,
    claimed_promotion_audience_vector: claimedAudienceVector,
    claimed_entity_dna_vector: claimedEntityDnaVector,
    claimed_entity_qets_vector: claimedEntityQetsVector,
    claimed_node_model_weight_vector: claimedNodeModelWeightVector,
    bounded_metadata: boundedMetadata,
    updated_at: now,
  };

  const qetsDnaLabel = {
    label_id: qetsLabelId,
    business_id: businessId,
    registry_id: "bham_registry_seed",
    candidate_id: candidateId,
    display_label: businessName,
    status: "pendingBhamRegistrySeed",
    authority: "pending_bham_registry_seed_claim_only",
    source_registry: "bham_registry_seed",
    strict_intake_version: "business_bham_seed_claim_v1",
    entity_profile_ref: `business_account:${businessId}`,
    actualizer_frame_ref: targetSpotId ? `api.spots:${targetSpotId}` : null,
    ingestion_receipt_ref: claimId,
    forcefield_receipt_id: forcefieldReceiptId,
    locality_ref: localityRef ?? null,
    category_refs: categoryRefs,
    source_refs: sourceRefs,
    derived_at: now,
    confidence: 0,
    entity_dna_vector: claimedEntityDnaVector,
    entity_qets_vector: claimedEntityQetsVector,
    metadata: {
      schemaVersion: "business_qets_dna_label_v1",
      businessAppSelfAssignedLabel: false,
      userAppStateCopied: false,
      canonicalQetsDnaLabelAuthority: false,
      pendingBhamRegistrySeedClaimId: claimId,
      strictBhamPromotionRequired: true,
      traceableHumanPersonalDataAllowed: false,
      containsCustomerPersonalData: false,
      source: "avrai.org/business",
    },
    updated_at: now,
  };

  const spotRow = center
    ? {
        id: targetSpotId,
        name: businessName,
        description,
        latitude: center.latitude,
        longitude: center.longitude,
        geohash: centroidGeohash,
        geohash_precision: 10,
        covering_geohashes: coveringGeohashes,
        place_boundary_source: "avrai_website_place_scan",
        place_boundary_status: "business_owner_submitted",
        place_boundary_sample_count: boundaryPoints.length,
        place_boundary_updated_at: now,
        business_entity_id: businessId,
        business_registry_ref: claimId,
        metadata: {
          schemaVersion: "avrai_website_place_scan_v1",
          source: "avrai_website_place_scan",
          businessAccountRef: businessId,
          seedClaimId: claimId,
          placeScanClaimId,
          forcefieldReceiptId,
          traceableHumanPersonalDataAllowed: false,
          containsCustomerPersonalData: false,
          businessOwnerClaimCreated: false,
          ownerDescriptionIsClaimOnly: true,
          canonicalQetsDnaLabelAuthority: false,
          boundarySamples: boundaryPoints,
          scanSessionId: scanSessionId || null,
        },
        address: location || null,
        category,
        tags: [...categoryRefs, ...audienceRefs].slice(0, 24),
        images: [],
        updated_at: now,
      }
    : undefined;

  const placeScanClaim = center
    ? {
        claim_id: placeScanClaimId,
        scanner_agent_ref: `website-place-scan-agent:${crypto.randomUUID()}`,
        place_label: businessName,
        place_description_claim: description,
        place_category_claim: category,
        provided_address: location || null,
        source: "avrai_website_place_scan",
        status: "projectedToPlaceRegistry",
        forcefield_receipt_id: forcefieldReceiptId,
        submitted_at: now,
        projected_at: now,
        registry_target: "api.spots",
        target_spot_id: targetSpotId,
        centroid_latitude: center.latitude,
        centroid_longitude: center.longitude,
        centroid_geohash: centroidGeohash,
        covering_geohashes: coveringGeohashes,
        boundary_sample_count: boundaryPoints.length,
        geohash_precision: 10,
        metadata: {
          schemaVersion: "public_place_scan_claim_v1",
          source: "avrai.org/business",
          traceableHumanPersonalDataAllowed: false,
          businessOwnerClaimCreated: false,
          publicScannerHumanIdentitySharedWithBusiness: false,
          containsCustomerPersonalData: false,
          businessAccountRef: businessId,
          seedClaimId: claimId,
          scanSessionId: scanSessionId || null,
          boundarySamples: boundaryPoints,
        },
        updated_at: now,
      }
    : undefined;

  try {
    await upsertSupabaseRow({
      config,
      table: "business_accounts",
      onConflict: "id",
      row: businessAccount,
    });

    if (spotRow) {
      await upsertSupabaseRow({
        config,
        schema: "api",
        table: "spots",
        onConflict: "id",
        row: spotRow,
      });
    }

    if (placeScanClaim) {
      await upsertSupabaseRow({
        config,
        table: "place_scan_claims",
        onConflict: "claim_id",
        row: placeScanClaim,
      });
    }

    await upsertSupabaseRow({
      config,
      table: "business_bham_registry_seed_claims",
      onConflict: "claim_id",
      row: seedClaim,
    });

    await upsertSupabaseRow({
      config,
      table: "business_qets_dna_labels",
      onConflict: "label_id",
      row: qetsDnaLabel,
    });
  } catch (error) {
    console.error(error);
    return publicError(
      "The business registry write failed. The route is live, but Supabase rejected part of the intake write.",
      502,
      "supabase_registry_write_failed",
    );
  }

  return NextResponse.json(
    {
      ok: true,
      businessId,
      seedClaimId: claimId,
      qetsDnaLabelId: qetsLabelId,
      placeScanClaimId: placeScanClaimId ?? null,
      targetSpotId: targetSpotId ?? null,
      centroidGeohash: centroidGeohash ?? null,
      boundaryPointCount: boundaryPoints.length,
      registryTargets: {
        businessAccount: "public.business_accounts",
        bhamSeedClaim: "public.business_bham_registry_seed_claims",
        qetsDnaLabel: "public.business_qets_dna_labels",
        placeScanClaim: placeScanClaim ? "public.place_scan_claims" : null,
        placeRegistry: spotRow ? "api.spots" : null,
      },
    },
    { status: 201 },
  );
}
