import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier";

// Compat wrapper for legacy plugins
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname
});

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      ...compat.extends("plugin:@tanstack/query/recommended"),
      prettier
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    }
  }
]);
