
import { Options } from "tsup"

const tsConfigPath = `${__dirname}/tsconfig.json`;

export const commonOptions: Options = {
    splitting: false,
    sourcemap: true,
    clean: false,
    dts: true,
    minify: true,
    treeshake: true,
    target: "esnext",
    tsconfig: tsConfigPath,
    format: ["cjs", "esm"],
}