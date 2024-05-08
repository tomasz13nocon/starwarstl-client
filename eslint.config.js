// New format of eslint config
// Not usable yet with the react plugin

import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import eslintConfigPrettier from "eslint-config-prettier";
// import jsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import js from "@eslint/js";
import globals from "globals";

export default [
	reactRecommended,
	js.configs.recommended,
	eslintConfigPrettier,
	{
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.browser,
			},
		},
		rules: {
			"no-unused-vars": "warn",
			"react/jsx-uses-react": "off",
			"react/prop-types": "off",
			"react/react-in-jsx-scope": "off",
			"react/jsx-no-target-blank": "off",
		},
	},
];
