import { NextResponse } from "next/server";
import { minikitConfig } from "../../../../minikit.config";

/**
 * Farcaster manifest endpoint for Mini-App configuration
 * This file is required for Mini-Apps to be recognized by Farcaster clients
 *
 * @see {@link https://docs.base.org/mini-apps/features/manifest}
 */
export async function GET() {
  return NextResponse.json(minikitConfig);
}
