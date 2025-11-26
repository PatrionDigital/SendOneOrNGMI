import { NextResponse } from "next/server";

/**
 * Farcaster manifest endpoint for Mini-App configuration
 * This file is required for Mini-Apps to be recognized by Farcaster clients
 */
export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  return NextResponse.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER || "",
      payload: process.env.FARCASTER_PAYLOAD || "",
      signature: process.env.FARCASTER_SIGNATURE || "",
    },
    frame: {
      version: "1",
      name: "Send $1 or NGMI",
      subtitle: "The Beautiful Ponzi",
      description:
        "Last 100 people to send $1 split the pot when timer expires. Every transaction resets the 42-minute countdown. Pure chaos.",
      iconUrl: `${URL}/icon.png`,
      splashImageUrl: `${URL}/splash.png`,
      splashBackgroundColor: "#000000",
      homeUrl: URL,
      webhookUrl: `${URL}/api/webhook`,
      primaryCategory: "social",
      categories: ["social", "gaming", "defi"],
      screenshotUrls: [`${URL}/screenshots/1.png`, `${URL}/screenshots/2.png`],
    },
  });
}
