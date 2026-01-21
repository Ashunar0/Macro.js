import { cac } from 'cac';
import type { CLIResult } from './types.js';

const VERSION = '0.1.0';

export function parseArgs(argv: string[]): CLIResult {
  const cli = cac('create-macro');

  cli
    .option('-y, --yes', 'Use default values for all prompts')
    .help()
    .version(VERSION);

  const parsed = cli.parse(argv, { run: false });

  // Get project name from positional arguments
  const projectName = parsed.args[0] as string | undefined;

  return {
    projectName,
    options: {
      yes: Boolean(parsed.options.yes),
    },
  };
}

export function showHelp(): void {
  const cli = cac('create-macro');
  cli
    .option('-y, --yes', 'Use default values for all prompts')
    .help()
    .version(VERSION);
  cli.outputHelp();
}

export function showVersion(): void {
  console.log(VERSION);
}

export { VERSION };
