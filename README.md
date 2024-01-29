# @holy-two/vite-plugin-alias

## illustration

This is a vite plugin that automatically retrieves and sets path aliases from [`tsconfig.json`](./playground/tsconfig.json).

### usage

```shell
npm i @holy-two/vite-plugin-alias -D
```

In `vite.config.ts`:

```diff
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
+ import vitePluginTemplate from '@holy-two/vite-plugin-alias'

export default defineConfig({
  plugins: [vue(),
+  vitePluginTemplate(),
  ],
})


```

You just need to configure it like this in `tsconfig.json`:

```diff
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
+    "baseUrl": ".",
+    "paths": {
+       "~/*": [
+         "src/*"
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
