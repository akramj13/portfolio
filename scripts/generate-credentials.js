const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Replace this with your actual admin password
const password = "MySecureAdminPassword123!";

console.log("🔐 Generating admin password hash...");
console.log("");

// Generate hash with cost factor of 12 (very secure)
const hash = bcrypt.hashSync(password, 12);

// Encode the hash to Base64 to avoid special characters in .env files
const encodedHash = Buffer.from(hash).toString("base64");

console.log("✅ Password hash generated!");
console.log("");
console.log("Add this to your .env file:");
console.log("=".repeat(60));
console.log(`ADMIN_PASSWORD_HASH=${encodedHash}`);
console.log("");
console.log("Also add a JWT secret:");
const jwt = crypto.randomBytes(32).toString("hex");
console.log(`JWT_SECRET=${jwt}`);
console.log("");
console.log("⚠️  Remember to:");
console.log("   1. Replace the sample password with your actual password");
console.log("   2. Generate a secure JWT secret (32+ characters)");
console.log("   3. Never commit .env files to version control");
console.log(
  "   4. The hash is Base64 encoded to avoid Docker Compose escaping issues"
);
