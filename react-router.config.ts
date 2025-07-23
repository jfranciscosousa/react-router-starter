import { vercelPreset } from "@vercel/react-router/vite";
import type { Config } from "@react-router/dev/config";

export default {
  future: { unstable_optimizeDeps: true },
  ssr: true,
  presets: [vercelPreset()],
} satisfies Config;
