import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Skip signin page and API auth endpoint
    if (
      request.nextUrl.pathname === "/admin/signin" ||
      request.nextUrl.pathname === "/admin/api/auth"
    ) {
      return NextResponse.next();
    }

    const token = request.cookies.get("admin-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/signin", request.url));
    }

    try {
      // Verify JWT token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);

      // Check if token has admin privileges
      if (!payload.admin) {
        return NextResponse.redirect(new URL("/admin/signin", request.url));
      }

      return NextResponse.next();
    } catch {
      // Token is invalid or expired
      const response = NextResponse.redirect(
        new URL("/admin/signin", request.url)
      );
      // Clear the invalid token
      response.cookies.set("admin-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
