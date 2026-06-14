import { Plugin } from 'vite';
import { dirname, join, resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import { parse } from 'jsonc-parser';

function stripWildcardSuffix(pattern: string): string {
  return pattern.replace(/\/\*$/, '');
}

function normalizePathMapping(mapping: string): string {
  if (!mapping.startsWith('.') && !mapping.startsWith('/')) {
    return `./${mapping}`;
  }
  return mapping;
}

function resolvePathReplacement(configDir: string, baseUrl: string, mapping: string): string {
  const normalized = normalizePathMapping(mapping);
  return resolve(configDir, baseUrl, stripWildcardSuffix(normalized));
}

const alias = () => {
  const cwd = process.cwd();
  const tsconfigPath = join(cwd, 'tsconfig.json');
  const jsconfigPath = join(cwd, 'jsconfig.json');

  const tsconfigExists = existsSync(tsconfigPath);
  const jsconfigExists = existsSync(jsconfigPath);

  if (!tsconfigExists && !jsconfigExists) {
    console.warn('tsconfig.json or jsconfig.json not found');
    return [];
  }

  const configPath = tsconfigExists ? tsconfigPath : jsconfigPath;
  const configDir = dirname(configPath);
  const configStr = readFileSync(configPath, 'utf8');
  const tsConfig = parse(configStr);
  const compilerOptions = tsConfig?.compilerOptions ?? {};
  const paths: TsConfigPaths | undefined = compilerOptions.paths;
  const baseUrl: string = compilerOptions.baseUrl ?? '.';

  if (!paths) {
    console.error("tsconfig.json's paths or jsconfig.json's paths not found");
    return [];
  }

  const alias: AliasArr = [];
  Object.entries(paths).forEach(([key, value]) => {
    const mapping = value[0];
    if (!mapping) return;
    alias.push({
      find: stripWildcardSuffix(key),
      replacement: resolvePathReplacement(configDir, baseUrl, mapping),
    });
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
}
