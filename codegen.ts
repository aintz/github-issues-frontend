import "dotenv/config";
import type { CodegenConfig } from "@graphql-codegen/cli";

const token = process.env.GH_TOKEN ?? process.env.VITE_GH_TOKEN;
if (!token) throw new Error("Missing GitHub token. Set GH_TOKEN or VITE_GH_TOKEN.");

const config: CodegenConfig = {
  schema: [
    {
      "https://api.github.com/graphql": {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  ],
  documents: ["src/**/*.{ts,tsx}"],
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-react-apollo"],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
        apolloReactHooksImportFrom: "@apollo/client/react",
        apolloReactCommonImportFrom: "@apollo/client",
        reactApolloVersion: 3,
      },
    },
  },

  overwrite: true,
};

export default config;
