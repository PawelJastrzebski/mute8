
import { Options } from "tsup"

export const commonOptions: Options = {
    splitting: false,
    sourcemap: true,
    clean: false,
    dts: true,
    minify: true,
    treeshake: true,
    target: "esnext",
    format: ["cjs", "esm"],
}