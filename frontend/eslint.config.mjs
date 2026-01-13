import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import _import from "eslint-plugin-import";
import jest from "eslint-plugin-jest";
import prettier from "eslint-plugin-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import tailwindcss from "eslint-plugin-tailwindcss";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    globalIgnores([
        "**/node_modules", 
        "**/jest", 
        "**/out", 
        "**/*.config.js", 
        "src/sdk", 
        "**/.next/**", 
        "**/public/storybook/**",
        "**/.storybook/**",
        "**/__mocks__/**",
        "**/playwright-report/**",
        "**/*.stories.tsx",
        "**/*.stories.ts",
        "**/e2e/**",
        "eslint.config.mjs",
        "next-env.d.ts",
        ".yarn/**",
    ]),
    {
        extends: fixupConfigRules(compat.extends(
            "plugin:@typescript-eslint/recommended",
            "plugin:import/recommended",
            "plugin:import/typescript",
            "plugin:tailwindcss/recommended",
            "plugin:prettier/recommended",
        )),

        plugins: {
            "@typescript-eslint": fixupPluginRules(typescriptEslint),
            import: fixupPluginRules(_import),
            prettier: fixupPluginRules(prettier),
            tailwindcss: fixupPluginRules(tailwindcss),
            "react-hooks": fixupPluginRules(reactHooks),
        },

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
            },

            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",

            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: import.meta.dirname,
            },
        },

        settings: {
            "import/resolver": {
                node: true,
                typescript: true,
            },
        },

        rules: {
            ...reactHooks.configs.recommended.rules,
            
            "@typescript-eslint/no-empty-function": "off",
            "@next/next/no-img-element": "off", // Next.js plugin not loaded to avoid circular dependency

            "tailwindcss/classnames-order": ["warn", {
                officialSorting: true,
            }],

            "tailwindcss/enforces-negative-arbitrary-values": "warn",
            "tailwindcss/enforces-shorthand": "warn",
            "tailwindcss/migration-from-tailwind-2": "warn",
            "tailwindcss/no-custom-classname": "off", // Allow custom CSS classes
            "tailwindcss/no-contradicting-classname": "error",
            "prettier/prettier": "error",
            "@typescript-eslint/no-explicit-any": "warn",
            "import/no-named-as-default": "off",
            "jsx-a11y/alt-text": "off",
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-require-imports": "off",

            "import/order": ["warn", {
                groups: [
                    "builtin",
                    ["external", "internal", "unknown"],
                    ["parent", "sibling", "index"],
                    "type",
                    "object",
                ],

                pathGroupsExcludedImportTypes: ["builtin"],

                pathGroups: [{
                    pattern: "react",
                    group: "external",
                    position: "before",
                }, {
                    pattern: "next",
                    group: "external",
                    position: "before",
                }, {
                    pattern: "next/**",
                    group: "external",
                    position: "before",
                }],
            }],
        },
    },
    {
        files: ["**/*.spec.{ts,tsx}"],
        extends: [...compat.extends("plugin:jest/recommended")],

        plugins: {
            jest,
        },

        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
    },
]);