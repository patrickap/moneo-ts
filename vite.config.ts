/// <reference types="vitest/config" />
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { nodePolyfills as polyfills } from "vite-plugin-node-polyfills";
import packageJson from "./package.json";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [
		polyfills({ include: ["util"], protocolImports: true }),
		dts({ tsconfigPath: "./tsconfig.build.json", rollupTypes: true }),
	],
	resolve: {
		alias: {
			"~": resolve(__dirname, "src"),
		},
	},
	build: {
		lib: {
			name: packageJson.name,
			entry: resolve(__dirname, "src/index.ts"),
			fileName: "index",
			formats: ["es", "cjs"],
		},
	},
});
