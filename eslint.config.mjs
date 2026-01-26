import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactNative from "eslint-plugin-react-native";
import prettier from "eslint-config-prettier";

export default defineConfig(
  // Ignored paths
  {
    ignores: [
      "node_modules/",
      "dist/",
      ".expo/",
      "ios/",
      "coverage/",
      "*.config.js",
      "*.config.mjs",
      "babel.config.js",
      "metro.config.js",
    ],
  },

  // Base JS rules
  js.configs.recommended,

  // TypeScript strict + stylistic
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // TypeScript parser options
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // React + React Native
  {
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-native": reactNative,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // React
      ...react.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React Native
      "react-native/no-unused-styles": "error",
      "react-native/no-inline-styles": "off",
      "react-native/no-color-literals": "off",
    },
  },

  // Project rules
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // Test files - relaxed rules
  {
    files: ["**/__tests__/*.ts", "**/__tests__/*.tsx"],
    rules: {
      // act(async () => {...}) needs async even without await
      "@typescript-eslint/require-await": "off",
      // Common pattern: assert then use with !
      "@typescript-eslint/no-non-null-assertion": "off",
      // Testing library types + JSON.parse return any/error types
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
    },
  },

  // Mock files - Jest globals
  {
    files: ["__mocks__/**/*.ts", "__mocks__/**/*.tsx"],
    languageOptions: {
      globals: {
        jest: "readonly",
      },
    },
  },

  // Prettier (disables conflicting rules)
  prettier,
);
