// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Liste des routes protégées
const protectedRoutes = ["/dashboard", "/"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("_token_web")?.value;

  // Si la route est protégée et qu'il n'y a pas de token → redirige vers login
  if (
    protectedRoutes.some((path) => request.nextUrl.pathname.startsWith(path)) &&
    (!token || token.length < 10) // vérifie que le token est valide
  ) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

// ✅ Matcher statique
export const config = {
  matcher: ["/dashboard/:path*", "/transactions/:path*"],
};