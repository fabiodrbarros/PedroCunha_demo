import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except those starting with:
  // /api, /pc-guest-admin, /_next, /uploads, or containing a file extension.
  matcher: ["/((?!api|pc-guest-admin|_next|_vercel|uploads|.*\\..*).*)"],
};
