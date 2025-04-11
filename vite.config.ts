/// <reference types="vitest/config" />
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	build: {
		lib: {
			name: "moneo-ts",
			entry: resolve(__dirname, "src/index.ts"),
		},
	},
	resolve: {
		alias: {
			"~": resolve(__dirname, "src"),
		},
	},
	test: {
		watch: false,
	},
	plugins: [
		nodePolyfills({ include: ["util"], protocolImports: true }),
		dts({ exclude: ["**/*.test.ts"] }),
	],
});
