import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

// POST /admin/api/auth - Sign in
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Compare with your hashed admin password
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH!;

    if (!adminPasswordHash) {
      console.error("ADMIN_PASSWORD_HASH environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const isValid = await bcrypt.compare(password, adminPasswordHash);

    if (!isValid) {
      // Add delay to prevent brute force attacks
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const token = await new SignJWT({
      admin: true,
      iat: Math.floor(Date.now() / 1000),
      iss: "portfolio-admin",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

// DELETE /admin/api/auth - Sign out
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return response;
}

// GET /admin/api/auth - Check authentication status
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    if (!payload.admin) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
