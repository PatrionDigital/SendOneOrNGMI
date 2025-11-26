import { NextRequest, NextResponse } from "next/server";

/**
 * Webhook endpoint for Farcaster Mini-App events
 * Handles notifications and other frame events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log webhook events for debugging
    console.log("Webhook received:", JSON.stringify(body, null, 2));

    // Handle different event types
    const { event } = body;

    switch (event) {
      case "frame_added":
        // User added the mini-app
        console.log("User added mini-app:", body.fid);
        break;

      case "frame_removed":
        // User removed the mini-app
        console.log("User removed mini-app:", body.fid);
        break;

      case "notifications_enabled":
        // User enabled notifications
        console.log("Notifications enabled for:", body.fid);
        break;

      case "notifications_disabled":
        // User disabled notifications
        console.log("Notifications disabled for:", body.fid);
        break;

      default:
        console.log("Unknown webhook event:", event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

/**
 * Health check for webhook endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Webhook endpoint is running",
  });
}
