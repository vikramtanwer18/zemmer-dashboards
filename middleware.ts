import { NextRequest, NextResponse } from "next/server";

const ACCESS_TOKEN_COOKIE = "gymos_access_token";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/2fa",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasToken = Boolean(req.cookies.get(ACCESS_TOKEN_COOKIE)?.value);

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (!hasToken && !isPublic) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasToken && isPublic) {
    const dashUrl = req.nextUrl.clone();
    dashUrl.pathname = "/dashboard";
    dashUrl.search = "";
    return NextResponse.redirect(dashUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.png|api/|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.webp$|.*\\.css$).*)",
  ],
};
