# @holy-two/vite-plugin-alias

![@holy-two/vite-plugin-alias](https://img.shields.io/npm/v/@holy-two/vite-plugin-alias.svg)

## Illustration

This is a vite plugin that automatically retrieves and sets path aliases from [`tsconfig.json`](./playground/tsconfig.json).

## Usage

```shell
npm i @holy-two/vite-plugin-alias -D
```

In `vite.config.ts`:

```diff
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
+ import alias from '@holy-two/vite-plugin-alias'

export default defineConfig({
  plugins: [vue(),
+  alias(),
  ],
})


```

You just need to configure it like this in `tsconfig.json`:

```diff
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
+    "paths": {
+       "~/*": [
+         "./src/*"
+       ]
+     }
  },
  "include": [
    "src/**/*.vue",
    "src/**/*.ts",
    "vite.config.ts"
  ],
}
```

`@holy-two/vite-plugin-alias` will automatically parse the paths set within the paths to define aliases.
So you can use `~/components/**` (same as `./src/components/**`) to access files.

Compatible with TypeScript 6.0+ where `compilerOptions.baseUrl` is removed (treated as `'.'`), and `compilerOptions.paths` values not starting with `'.'` are treated as `'./'` prefixed.
