import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/adminAuth";
import { listRegistrations, registrationsToCsv } from "@/lib/registrations";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!isValidSessionToken(token)) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const registrations = await listRegistrations();
    const csv = registrationsToCsv(registrations);
    const date = new Date().toISOString().slice(0, 10);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="hackurity-registrations-${date}.csv"`,
      },
    });
  } catch (err) {
    console.error("Failed to export registrations:", err);
    return NextResponse.json({ error: "Could not export registrations." }, { status: 500 });
  }
}
