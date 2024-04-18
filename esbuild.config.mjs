import autoprefixer from "autoprefixer";
import * as esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import postcss from "postcss";
import postcssPresetEnv from "postcss-preset-env";

await esbuild.build({
	entryPoints: ["./src/index.umd.js"],
	bundle: true,
	minify: true,
	format: "iife",
	outfile: "dist/index.umd.js",
	sourcemap: true,
});

await esbuild.build({
	entryPoints: ["./src/index.esm.js"],
	keepNames: true,
	bundle: true,
	// TODO: Add link to documented types since build for esm gets its comments removed
	format: "esm",
	outfile: "dist/index.esm.js",
	sourcemap: true,
});

await esbuild.build({
	entryPoints: ["./src/styles.css"],
	bundle: true,
	minify: true,
	sourcemap: true,
	outfile: "dist/styles.css",
	plugins: [
		sassPlugin({
			async transform(source, resolveDir, filePath) {
				const { css } = await postcss([
					autoprefixer,
					postcssPresetEnv({ stage: 0 }),
				]).process(source, { from: filePath });

				return css;
			},
		}),
	],
});
