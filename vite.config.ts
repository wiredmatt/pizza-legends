import replace from '@rollup/plugin-replace'
import { defineConfig } from 'vite'

import { compilerOptions } from './tsconfig.json'

import { resolve } from 'path'

const alias = Object.entries(compilerOptions.paths).reduce(
  (acc, [key, [value]]) => {
    const aliasKey = key.substring(0, key.length - 2)
    const path = value.substring(0, value.length - 2)
    return {
      ...acc,
      [aliasKey]: resolve(__dirname, path)
    }
  },
  {}
)

export default defineConfig({
  resolve: {
    alias
  },
  build: {
    rollupOptions: {
      plugins: [
        //  Toggle the booleans here to enable / disable Phaser 3 features:
        replace({
          'typeof CANVAS_RENDERER': "'true'",
          'typeof WEBGL_RENDERER': "'true'",
          'typeof EXPERIMENTAL': "'true'",
          'typeof PLUGIN_CAMERA3D': "'false'",
          'typeof PLUGIN_FBINSTANT': "'false'",
          'typeof FEATURE_SOUND': "'true'"
        })
      ]
    }
  }
})
