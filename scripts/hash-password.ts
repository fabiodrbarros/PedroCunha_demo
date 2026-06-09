import bcrypt from "bcryptjs";

/**
 * Generate a bcrypt hash for the admin password.
 * Usage:  npm run hash -- "your-strong-password"
 */
async function main() {
  const password = process.argv[2];
  if (!password) {
    console.error('Usage: npm run hash -- "your-password"');
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 12);
  // Escape "$" as "\$" so Next.js' env loader doesn't expand $2a/$12 as vars.
  const escaped = hash.replace(/\$/g, "\\$");
  console.log("\nbcrypt hash:\n");
  console.log("  " + hash);
  console.log("\nPaste this line into your .env (dollars escaped for Next):\n");
  console.log(`ADMIN_PASSWORD_HASH="${escaped}"\n`);
}

main();
