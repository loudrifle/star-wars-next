import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // Config base ESLint
  eslint.configs.recommended,

  // Config TypeScript
  tseslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,

  // Config Next.js
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Custom Rules
  {
    ignores: ["*.cjs", "node_modules/**", "out/**", ".next/**"],

    languageOptions: {
      parserOptions: {
        project: join(__dirname, "tsconfig.json"),
        tsconfigRootDir: __dirname,
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },

    rules: {
      // TypeScript
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        { allowExpressions: true },
      ],
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/array-type": ["error", { default: "array-simple" }],

      // JavaScript
      "no-unused-vars": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      eqeqeq: ["error", "always"],

      // Next.js
      "@next/next/no-html-link-for-pages": ["error", "app"],
      "@next/next/no-img-element": "warn",
    },
  },
];
