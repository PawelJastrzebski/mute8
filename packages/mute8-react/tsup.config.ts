import { defineConfig } from 'tsup'
import {commonOptions} from "../tsup.common"
 
export default defineConfig((options) => {
  const watch = options.watch;
  return {
    ...commonOptions,
    entry: ['mute8-react.ts'],
    minify: !watch,
  }
})