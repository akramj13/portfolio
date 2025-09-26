import { execSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";

class CDNUploader {
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:3001") {
    this.baseUrl = baseUrl;
  }

  async uploadFile(file: File, filename: string): Promise<string> {
    try {
      // Create a temporary file
      const tempPath = join("/tmp", `upload_${Date.now()}_${filename}`);

      // Write the file to temp location
      const buffer = await file.arrayBuffer();
      writeFileSync(tempPath, Buffer.from(buffer));

      try {
        // First, ensure the projects directory exists in the CDN volume
        execSync(
          `docker exec portfolio-cdn mkdir -p /usr/share/nginx/html/projects`
        );

        // Copy the file to CDN volume
        execSync(
          `docker cp "${tempPath}" portfolio-cdn:/usr/share/nginx/html/projects/${filename}`
        );

        // Return the CDN URL
        return `${this.baseUrl}/projects/${filename}`;
      } finally {
        // Clean up temp file
        try {
          unlinkSync(tempPath);
        } catch (cleanupError) {
          console.warn("Failed to clean up temp file:", cleanupError);
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error(
        `Failed to upload file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      execSync(
        `docker exec portfolio-cdn rm -f /usr/share/nginx/html/projects/${filename}`
      );
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new Error(
        `Failed to delete file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async listFiles(): Promise<string[]> {
    try {
      const output = execSync(
        `docker exec portfolio-cdn find /usr/share/nginx/html/projects -type f -name "*" 2>/dev/null || echo ""`,
        { encoding: "utf8" }
      );

      return output
        .trim()
        .split("\n")
        .filter((line: string) => line.length > 0)
        .map((line: string) =>
          line.replace("/usr/share/nginx/html/projects/", "")
        );
    } catch (error) {
      console.error("Error listing files:", error);
      return [];
    }
  }
}

export const cdnUploader = new CDNUploader();
