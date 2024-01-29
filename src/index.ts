import { Plugin } from 'vite';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import stripJsonComments from 'strip-json-comments';

const alias = () => {
  const tsconfigPath = join(process.cwd(), 'tsconfig.json');
  const jsconfigPath = join(process.cwd(), 'jsconfig.json');

  const tsconfigExists = existsSync(tsconfigPath);
  const jsconfigExists = existsSync(jsconfigPath);

  if (!tsconfigExists && !jsconfigExists) {
    console.warn('tsconfig.json or jsconfig.json not found');
  };

  let configStr = '';
  if (tsconfigExists) {
    configStr = readFileSync(tsconfigPath, 'utf8');
  } else {
    configStr = readFileSync(jsconfigPath, 'utf8');
  };
  const tsConfig = JSON.parse(stripJsonComments(configStr.replace(/,\s*([\]}])/g, '$1')));
  const paths: TsConfigPaths = tsConfig?.compilerOptions?.paths;

  if (!paths) {
    console.warn("tsconfig.json's paths or jsconfig.json's paths not found");
  };

  // todo: 未处理 tsconfig.json 中的 baseUrl
  // todo: 判断数据格式是否正确

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