export function generateGitignore(): string {
  const lines = [
    'node_modules/',
    'dist/',
    '.clasprc.json',
  ];
  return lines.join('\n') + '\n';
}
