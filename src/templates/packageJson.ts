import type { Language } from '../types.js';

export interface PackageJsonOptions {
  projectName: string;
  language: Language;
}

interface PackageJsonContent {
  name: string;
  version: string;
  scripts: Record<string, string>;
  devDependencies: Record<string, string>;
}

export function generatePackageJson(options: PackageJsonOptions): string {
  const { projectName, language } = options;

  const baseConfig: PackageJsonContent = {
    name: projectName,
    version: '1.0.0',
    scripts: {
      login: 'npx clasp login',
      push: 'node scripts/push.js',
      open: 'npx clasp open',
    },
    devDependencies: {
      '@google/clasp': '^2.4.2',
      'cpy-cli': '^5.0.0',
    },
  };

  if (language === 'typescript') {
    baseConfig.scripts = {
      build: 'tsc && cpy src/appsscript.json dist --flat',
      ...baseConfig.scripts,
      push: 'tsc && cpy src/appsscript.json dist --flat && node scripts/push.js',
    };
    baseConfig.devDependencies = {
      ...baseConfig.devDependencies,
      'typescript': '^5.3.0',
      '@types/google-apps-script': '^1.0.83',
    };
  } else {
    baseConfig.scripts = {
      build: "cpy 'src/**/*' dist --flat",
      ...baseConfig.scripts,
      push: "cpy 'src/**/*' dist --flat && node scripts/push.js",
    };
  }

  return JSON.stringify(baseConfig, null, 2) + '\n';
}
