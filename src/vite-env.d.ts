/**
 * src/vite-env.d.ts
 * Exposes Vite environment types to the browser-side TypeScript source set.
 * Connects to: src/config/app-config.ts, tsconfig.app.json
 * Created: 2026-06-18
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOG_LEVEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
