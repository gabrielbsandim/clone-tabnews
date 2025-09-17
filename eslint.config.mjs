import js from "@eslint/js";
import globals from "globals";
import jestPlugin from "eslint-plugin-jest";
import prettier from "eslint-config-prettier";
import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  // Next.js legacy config via compat (core-web-vitals)
  ...compat.extends("next/core-web-vitals"),

  // Explicit ignores (flat config has no implicit ignores)
  {
    ignores: [
      "**/node_modules/**",
      "**/.yarn/**",
      "**/.next/**",
      "**/coverage/**",
      "**/dist/**",
      "**/build/**",
      "out/**",
      "next-env.d.ts",
      ".eslintrc.*",
      "eslint.config.*",
    ],
  },

  // Base recommended rules
  js.configs.recommended,

  // Project defaults (Node ESM)
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        // Node 18+ / Next.js provides fetch as a global in the runtime
        fetch: "readonly",
        Request: "readonly",
        Response: "readonly",
        Headers: "readonly",
      },
    },
    plugins: {
      jest: jestPlugin,
    },
  },

  // Jest rules for test files
  {
    files: ["tests/**/*.{js,jsx,ts,tsx}", "**/*.test.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      ...(jestPlugin.configs?.recommended?.rules || {}),
    },
  },

  // Disable formatting-related rules in favor of Prettier
  prettier,
];

export default config;
