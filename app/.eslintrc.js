module.exports = {
  extends: ["taro", "plugin:prettier/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    useJSXTextNode: true,
  },
  rules: {
    "react/jsx-filename-extension": [
      1,
      { extensions: [".js", ".jsx", ".tsx"] }
    ],

    // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
    "default-case": "off",
    // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
    "no-dupe-class-members": "off",
    // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
    "no-undef": "off",

    // Add TypeScript specific rules (and turn off ESLint equivalents)
    "@typescript-eslint/no-angle-bracket-type-assertion": "warn",
    "no-array-constructor": "off",
    "@typescript-eslint/no-array-constructor": "warn",
    "@typescript-eslint/no-namespace": "error",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": [
      "warn",
      {
        functions: false,
        classes: false,
        variables: false,
        typedefs: false
      }
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        args: "none",
        ignoreRestSiblings: true,
        varsIgnorePattern: "Taro"
      }
    ],
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "warn"
  },
};
