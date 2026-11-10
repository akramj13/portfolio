import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function verifyAdminAuth(request: NextRequest): Promise<boolean> {
  try {
    const token = request.cookies.get("admin-token")?.value;

    if (!token) {
      return false;
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    // Check if token has admin privileges
    return payload.admin === true;
  } catch {
    return false;
  }
}

export function createUnauthorizedResponse() {
  return Response.json(
    { error: "Unauthorized. Admin access required." },
    { status: 401 }
  );
}
