import { Plugin } from 'vite';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import stripJsonComments from 'strip-json-comments';

const filePath = join(process.cwd(), 'tsconfig.json');

const alias = () => {
  const fileExists = existsSync(filePath);
  if (!fileExists) {
    return [{ find: '@', replacement: join(process.cwd(), 'src') }]
  };

  const tsConfigStr = readFileSync(filePath, 'utf8');
  const tsConfig = JSON.parse(stripJsonComments(tsConfigStr.replace(/,\s*([\]}])/g, '$1')));
  const paths: TsConfigPaths = tsConfig?.compilerOptions?.paths;
  if (!paths) {
    return [{ find: '@', replacement: join(process.cwd(), 'src') }]
  };

  const alias: AliasArr = [];
  Object.entries(paths).forEach(([key, value]) => {
    alias.push(({ find: key?.replace(/\/\*$/, ''), replacement: join(process.cwd(), value[0]?.replace(/\/\*$/, '')) }));
  });
  
  return alias;
};

export default function vitePluginTemplate(): Plugin {
  return {
    name: 'vite-plugin-alias-from-types',
    config: () => ({
      resolve: {
        alias: alias(),
      }
    }),
  };
};