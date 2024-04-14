import * as esbuild from "esbuild";

await esbuild.build({
    entryPoints: ["./src/index.umd.js"],
    bundle: true,
    minify: true,
    format: "iife",
    outfile: "dist/index.umd.js",
    sourcemap: true
});

await esbuild.build({
    entryPoints: ["./src/index.esm.js"],
    keepNames: true,
    bundle: false,
    // TODO: Add link to documented types since build for esm gets its comments removed
    format: "esm",
    outfile: "dist/index.esm.js",
    sourcemap: true,
})

await esbuild.build({
    entryPoints: ["./src/styles.css"],
    bundle: true,
    minify: true,
    sourcemap: true,
    outfile: "dist/styles.css",
})
