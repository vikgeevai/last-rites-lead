import { NextRequest, NextResponse } from "next/server";
import sql, { initDb } from "@/lib/db";
import { sendCustomerEmail, sendBusinessLeadEmail } from "@/lib/email";

const ALLOWED_ORIGINS = [
  "https://indian-life-memorial.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key",
  };
}

function validateApiKey(req: NextRequest): boolean {
  const key = req.headers.get("x-api-key");
  return key === process.env.CRM_API_KEY;
}

// ── OPTIONS (preflight) ────────────────────────────────────────────────────
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

// ── POST — receive a new lead ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  if (!validateApiKey(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers });
  }

  const {
    name, email, phone, address,
    planning_type, arrangement_type, disposition_type,
    wake_duration, location,
    coffin_choice, high_end_interest, tentage_selected, floral_photo_frame,
    estimated_cost, deceased_name, death_cert_no,
    selected_coffin_image,
  } = body;

  if (!name || !phone) {
    return NextResponse.json({ error: "name and phone are required" }, { status: 422, headers });
  }

  const service = [arrangement_type, planning_type].filter(Boolean).join(" — ");
  const notes = [
    location && `Location: ${location}`,
    coffin_choice && `Casket: ${coffin_choice}`,
    high_end_interest && high_end_interest !== "No" && `High-end interest: ${high_end_interest}`,
    tentage_selected === "Yes" && "Tentage: Yes",
    floral_photo_frame === "Yes" && "Floral photo frame: Yes",
    deceased_name && `Deceased: ${deceased_name}`,
    death_cert_no && `Death cert: ${death_cert_no}`,
  ].filter(Boolean).join(" · ");

  try {
    await initDb();

    const rows = await sql`
      INSERT INTO leads (
        name, email, phone, address,
        service, source, status, notes,
        planning_type, arrangement_type, disposition_type,
        wake_duration, location,
        coffin_choice, high_end_interest, tentage_selected, floral_photo_frame,
        estimated_cost, deceased_name, death_cert_no
      ) VALUES (
        ${name}, ${email ?? null}, ${phone}, ${address ?? null},
        ${service}, 'website', 'new', ${notes},
        ${planning_type ?? null}, ${arrangement_type ?? null}, ${disposition_type ?? null},
        ${wake_duration ?? null}, ${location ?? null},
        ${coffin_choice ?? null}, ${high_end_interest ?? null}, ${tentage_selected ?? null}, ${floral_photo_frame ?? null},
        ${estimated_cost ?? null}, ${deceased_name ?? null}, ${death_cert_no ?? null}
      )
      RETURNING id, created_at
    `;

    const lead = rows[0];

    // Send emails (non-blocking — don't let email failure block lead storage)
    if (process.env.RESEND_API_KEY) {
      const emailData = {
        name, email: email ?? "",
        arrangementType: arrangement_type ?? "",
        planningType: planning_type ?? "",
        dispositionType: disposition_type ?? "",
        wakeDuration: wake_duration ?? "",
        location: location ?? "",
        coffinChoice: coffin_choice ?? "",
        estimatedCost: estimated_cost ?? "",
        coffinImageUrl: selected_coffin_image,
      };

      await Promise.allSettled([
        email ? sendCustomerEmail(emailData) : Promise.resolve(),
        sendBusinessLeadEmail({
          ...emailData,
          phone, address: address ?? "",
          highEndInterest: high_end_interest ?? "No",
          tentageSelected: tentage_selected ?? "No",
          floralPhotoFrame: floral_photo_frame ?? "No",
          deceasedName: deceased_name,
          deathCertNo: death_cert_no,
        }),
      ]);
    }

    return NextResponse.json({ success: true, id: lead.id }, { status: 201, headers });
  } catch (err) {
    console.error("[/api/leads POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers });
  }
}

// ── GET — list all leads (dashboard) ─────────────────────────────────────
export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  if (!validateApiKey(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
  }

  try {
    await initDb();

    const rows = await sql`
      SELECT
        id::text,
        created_at AS date,
        name, email, phone, address,
        service, source, status, notes,
        planning_type, arrangement_type, disposition_type,
        wake_duration, location,
        coffin_choice, high_end_interest,
        tentage_selected, floral_photo_frame,
        estimated_cost, deceased_name, death_cert_no,
        response_time AS "responseTime"
      FROM leads
      ORDER BY created_at DESC
    `;

    return NextResponse.json(rows, { headers });
  } catch (err) {
    console.error("[/api/leads GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers });
  }
}

// ── PATCH — update lead status ────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  if (!validateApiKey(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
  }

  let body: { id: string; status: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers });
  }

  const validStatuses = ["new", "contacted", "qualified", "junk", "archived"];
  if (!body.id || !validStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid id or status" }, { status: 422, headers });
  }

  try {
    await sql`
      UPDATE leads SET status = ${body.status} WHERE id = ${parseInt(body.id)}
    `;
    return NextResponse.json({ success: true }, { headers });
  } catch (err) {
    console.error("[/api/leads PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers });
  }
}
