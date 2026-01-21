export interface ClaspJsonOptions {
  scriptId?: string;
}

export function generateClaspJson(options: ClaspJsonOptions = {}): string {
  const config = {
    scriptId: options.scriptId ?? '',
    rootDir: './dist',
  };
  return JSON.stringify(config, null, 2) + '\n';
}
