import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  const { pathname } = request.nextUrl;


  if (pathname.startsWith("/Dashboard")) {
    if (!token) {
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/" || pathname === "/register") {
    if (token) {
      const dashboardUrl = new URL("/Dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/Dashboard/:path*",
    "/",
    "/register"
  ]
};
