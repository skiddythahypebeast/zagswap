import NextAuth from "next-auth";
import { authOptions } from "./auth-options";
import { NextResponse, type NextRequest } from "next/server";

export const GET = NextAuth(authOptions) as (request: NextRequest) => Promise<NextResponse>;
export const POST = NextAuth(authOptions) as (request: NextRequest) => Promise<NextResponse>;
export const OPTIONS = (_: NextRequest) => {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    return new NextResponse(null, { status: 200, headers });
};