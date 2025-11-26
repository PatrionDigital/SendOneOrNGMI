import { NextRequest, NextResponse } from "next/server";

/**
 * Paymaster proxy endpoint
 * Forwards requests to Coinbase Developer Platform Paymaster
 * This proxy pattern keeps the Paymaster URL secure on the server
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required environment variable
    const paymasterUrl = process.env.CDP_PAYMASTER_URL;
    if (!paymasterUrl) {
      console.error("CDP_PAYMASTER_URL not configured");
      return NextResponse.json(
        { error: "Paymaster not configured" },
        { status: 500 }
      );
    }

    // Forward request to Coinbase Developer Platform Paymaster
    const response = await fetch(paymasterUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Paymaster error:", response.status, errorText);
      return NextResponse.json(
        { error: "Paymaster request failed", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Paymaster proxy error:", error);
    return NextResponse.json(
      { error: "Paymaster request failed" },
      { status: 500 }
    );
  }
}

/**
 * Health check for paymaster endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Paymaster proxy is running",
    configured: !!process.env.CDP_PAYMASTER_URL,
  });
}
