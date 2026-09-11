import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/adminAuth";
import { listRegistrations } from "@/lib/registrations";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!isValidSessionToken(token)) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const registrations = await listRegistrations();
    return NextResponse.json({ registrations });
  } catch (err) {
    console.error("Failed to list registrations:", err);
    return NextResponse.json({ error: "Could not load registrations." }, { status: 500 });
  }
}
