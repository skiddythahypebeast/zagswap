import NextAuth from "next-auth";
import { authOptions } from "./auth-options";
import { type NextRequest, type NextResponse } from "next/server";

export const GET = NextAuth(authOptions) as (request: NextRequest) => Promise<NextResponse>;
export const POST = NextAuth(authOptions) as (request: NextRequest) => Promise<NextResponse>;