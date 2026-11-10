import { NextResponse } from "next/server";

export async function GET() {
  // Return the CDN URL for the current resume
  const resumeUrl = "http://localhost:3001/resume.pdf";

  return NextResponse.json({
    url: resumeUrl,
    message: "Current resume URL",
  });
}
