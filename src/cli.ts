import { cac } from 'cac';
import type { CLIResult } from './types.js';

const VERSION = '0.1.0';

export interface ParseResult {
  result: CLIResult | null;
  shouldExit: boolean;
}

export function parseArgs(argv: string[]): ParseResult {
  const cli = cac('create-macro');

  cli
    .option('-y, --yes', 'Use default values for all prompts')
    .help()
    .version(VERSION);

  const parsed = cli.parse(argv, { run: false });

  // Check for help or version flags
  // Note: cac automatically outputs help/version with { run: false }
  if (parsed.options.help || parsed.options.version) {
    return { result: null, shouldExit: true };
  }

  // Get project name from positional arguments
  const projectName = parsed.args[0] as string | undefined;

  return {
    result: {
      projectName,
      options: {
        yes: Boolean(parsed.options.yes),
      },
    },
    shouldExit: false,
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
