// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  interface JWT {
    sub: string,
    exp: number,
    fee: string,
    token_balance: string,
    iat: number,
    swap_api_key: string,
    jti: string
  }
}

declare module "next-auth" {
  interface User {
    id: string,
    fee: string,
    token_balance: string
  }
  interface Session {
    user: User
  }
}