module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "airbnb",
    "airbnb-typescript",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "vite.config.ts", "*.js", "useTappay.ts"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    quotes: ["error", "double"],
    "linebreak-style": 0,
    "max-len": "off",
    "implicit-arrow-linebreak": "off",
    "react/react-in-jsx-scope": "off",
    "react/function-component-definition": "off",
    "react/prop-types": "off",
    "react/jsx-one-expression-per-line": "off",
    "react/jsx-props-no-spreading": "off",
    "jsx-a11y/control-has-associated-label": "off",
    "@typescript-eslint/quotes": "off",
    "operator-linebreak": "off",
    "object-curly-newline": "off",
  },
};
