export function generateTsconfig(): string {
  const config = {
    compilerOptions: {
      target: 'ES2020',
      module: 'None',
      lib: ['ES2020'],
      outDir: './dist',
      rootDir: './src',
      strict: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      types: ['google-apps-script'],
    },
    include: ['src/**/*'],
  };
  return JSON.stringify(config, null, 2) + '\n';
}
