import { NextRequest, NextResponse } from "next/server";
import { getRpcBaseUrl } from "@/lib/rpc-client";
import type { NetworkId } from "@/lib/rpc-types";

function isValidNetwork(v: string | null): v is NetworkId {
  return v === "testnet" || v === "mainnet";
}

/**
 * Same-origin JSON-RPC proxy so the browser never calls the Boing node directly.
 * Avoids CORS/preflight failures when the tunnel or an intermediary strips
 * Access-Control-* on OPTIONS or errors.
 */
export async function POST(req: NextRequest) {
  const network = req.headers.get("x-boing-rpc-network");
  if (!isValidNetwork(network)) {
    return NextResponse.json(
      { error: "Missing or invalid X-Boing-RPC-Network (testnet | mainnet)" },
      { status: 400 }
    );
  }

  let upstreamBase: string;
  try {
    upstreamBase = getRpcBaseUrl(network);
  } catch (e) {
    const message = e instanceof Error ? e.message : "RPC not configured";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    body === null ||
    typeof body !== "object" ||
    (body as { jsonrpc?: unknown }).jsonrpc !== "2.0" ||
    typeof (body as { method?: unknown }).method !== "string"
  ) {
    return NextResponse.json({ error: "Invalid JSON-RPC 2.0 request" }, { status: 400 });
  }

  const upstreamUrl = upstreamBase.endsWith("/") ? upstreamBase : `${upstreamBase}/`;

  try {
    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await upstream.text();
    const ct = upstream.headers.get("Content-Type") ?? "application/json";
    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": ct },
    });
  } catch {
    const id = typeof (body as { id?: unknown }).id === "number" ? (body as { id: number }).id : 0;
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id,
        error: { code: -32_000, message: "Upstream RPC unreachable" },
      },
      { status: 502 }
    );
  }
}
