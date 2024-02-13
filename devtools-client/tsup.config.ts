import { defineConfig } from 'tsup'
export default defineConfig((options) => {
  return {
    splitting: false,
    sourcemap: false,
    clean: false,
    dts: false,
    minify: true,
    treeshake: true,
    target: "esnext",
    entry: ['v1.ts'],
    format: ["esm"],
  }
})