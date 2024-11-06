import eslintConfig from "@keeex/eslint-config";

export default await eslintConfig({
  ignores: ["dist"],
  mocha: false,
  react: true,
  typescript: false,
});
