import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // 'secret' should be the same 'process.env.SECRET' use in NextAuth function
  const session = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  ///console.log("session in middleware: ", session);

  if (!session)
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/employees/:path*",
    "/events/:path*",
    "/qr/:path*",
    "/api/employee",
    "/api/employees_events",
    "/api/event",
    "/api/image",
    "/api/qrcode",
    "/",
  ],
};
