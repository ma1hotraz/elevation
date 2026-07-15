import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseSecretKey } from "@/lib/env";
import { enquirySchema, firstZodError } from "@/lib/portal/schemas";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const MAX_BODY_BYTES = 20_000;
const NO_STORE_HEADERS = { "Cache-Control": "no-store" } as const;

function json(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: { ...NO_STORE_HEADERS, ...init?.headers },
  });
}

function requestIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json({ error: "The enquiry is too large." }, { status: 413 });
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ error: "This endpoint accepts JSON requests only." }, { status: 415 });
  }

  const parsed = enquirySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return json({ error: firstZodError(parsed.error) }, { status: 400 });
  }

  if (parsed.data.website) {
    return json({ ok: true }, { status: 202 });
  }

  try {
    const ip = requestIp(request);
    const salt = process.env.ENQUIRY_HASH_SALT?.trim() || getSupabaseSecretKey();
    const ipHash = createHash("sha256").update(`${salt}:${ip}`).digest("hex");
    const rateKey = createHash("sha256").update(`enquiry:${ipHash}`).digest("hex");
    const admin = createSupabaseAdminClient();
    const { data: rateRows, error: rateError } = await admin.rpc("consume_request_rate_limit", {
      p_key: rateKey,
      p_limit: 5,
      p_window_seconds: 10 * 60,
    });

    if (rateError || !rateRows?.[0]) {
      return json({ error: "The enquiry service is temporarily unavailable." }, { status: 503 });
    }

    if (!rateRows[0].allowed) {
      return json(
        { error: "Too many enquiries were submitted. Please try again in a few minutes." },
        {
          status: 429,
          headers: { "Retry-After": String(rateRows[0].retry_after) },
        },
      );
    }

    const { error } = await admin.from("enquiries").insert({
      full_name: parsed.data.fullName,
      contact: parsed.data.contact,
      course: parsed.data.course,
      preferred_time: parsed.data.preferredTime,
      message: parsed.data.message,
      source: "website",
      ip_hash: ipHash,
    });

    if (error) {
      return json(
        { error: "We could not submit your enquiry right now. Please contact the institute directly." },
        { status: 500 },
      );
    }

    return json({ ok: true }, { status: 201 });
  } catch {
    return json({ error: "The enquiry service is temporarily unavailable." }, { status: 503 });
  }
}


