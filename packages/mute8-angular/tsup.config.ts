import { defineConfig } from 'tsup'
import {commonOptions} from "../tsup.common"
 
export default defineConfig((options) => {
  const watch = options.watch;
  return {
    ...commonOptions,
    entry: ['mute8-angular.ts'],
    minify: false
  }
})