import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except those starting with:
  // /api, /admin, /_next, /uploads, or containing a file extension.
  matcher: ["/((?!api|admin|_next|_vercel|uploads|.*\\..*).*)"],
};
