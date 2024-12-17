import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        text: "#171717", // neutral-900
        "text-two": "white",
        primary: "#3b82f6", // blue-500
        secondary: "#475569", // slate-600
        bg1: "white", // white
        bg2: "#e2e8f0", // slate-50
        bg3: "#f1f5f9", // slate-100
        bg4: "#e2e8f0", // slate-200
        bg5: "#cbd5e1", // slate-300
        input: "#e5e7eb", // zinc-200
        shadow: "#00000020",
        dark: {
          text: "#d1d5db",
          "text-two": "#d1d5db",
          primary: "#fb923c",
          secondary: "black",
          bg1: "#18181b",
          bg2: "#09090b",
          bg3: "#27272a",
          shadow: "#00000099",
          bg4: "#171717",
          bg5: "#1c1917",
          input: "#3f3f46",
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
