import "server-only";
import bcrypt from "bcryptjs";

/**
 * Verify admin credentials against the environment configuration.
 * ADMIN_USERNAME       — plain username
 * ADMIN_PASSWORD_HASH  — bcrypt hash (generate with `npm run hash`)
 */
export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;

  if (!expectedUser || !expectedHash) {
    console.error("Admin credentials are not configured in the environment.");
    return false;
  }

  // Constant-ish comparison: always run bcrypt to avoid trivial timing leaks.
  const userMatches = timingSafeEqual(username, expectedUser);
  let passwordMatches = false;
  try {
    passwordMatches = await bcrypt.compare(password, expectedHash);
  } catch {
    passwordMatches = false;
  }

  return userMatches && passwordMatches;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
