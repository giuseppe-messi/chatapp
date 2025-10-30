import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";

export default defineConfig([
  globalIgnores(["dist", "node_modules", "coverage"]),
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["dist", "node_modules", "coverage", "prisma/**", "generated/**"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettier
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.node,
      parserOptions: {
        project: "./tsconfig.json"
      }
    },
    rules: {}
  }
]);
