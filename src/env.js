import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    SERVER_URL: z.string(),
    API_KEY_WITH_FEE: z.string(),
    API_KEY_FREE: z.string(),
    PROVIDER_URL: z.string(),
    NEXTAUTH_SECRET: z.string(),
    TREASURY_ADDRESS: z.string(),
    REVSHARE_ADDRESS: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_TREASURY_ADDRESS: z.string(),
    NEXT_PUBLIC_REVSHARE_ADDRESS: z.string(),
    NEXT_PUBLIC_PROVIDER_URL: z.string()
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    PROVIDER_URL: process.env.PROVIDER_URL,
    NEXT_PUBLIC_PROVIDER_URL: process.env.NEXT_PUBLIC_PROVIDER_URL,
    API_KEY_FREE: process.env.API_KEY_FREE,
    NODE_ENV: process.env.NODE_ENV,
    API_KEY_WITH_FEE: process.env.API_KEY_WITH_FEE,
    SERVER_URL: process.env.SERVER_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    TREASURY_ADDRESS: process.env.TREASURY_ADDRESS,
    REVSHARE_ADDRESS: process.env.REVSHARE_ADDRESS,
    NEXT_PUBLIC_TREASURY_ADDRESS: process.env.NEXT_PUBLIC_TREASURY_ADDRESS,
    NEXT_PUBLIC_REVSHARE_ADDRESS: process.env.NEXT_PUBLIC_REVSHARE_ADDRESS
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
