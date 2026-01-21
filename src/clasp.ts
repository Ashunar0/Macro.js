import { spawn } from 'node:child_process';
import type { ProjectType, ClaspCreateResult, ClaspErrorType } from './types.js';
import { updateJsonFile } from './utils/fs.js';

interface ClaspJson {
  scriptId: string;
  rootDir?: string;
}

function runCommand(command: string, args: string[], cwd?: string): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    const proc = spawn(command, args, {
      cwd,
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    proc.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      resolve({ stdout, stderr, code: code ?? 1 });
    });

    proc.on('error', () => {
      resolve({ stdout, stderr, code: 1 });
    });
  });
}

export async function checkLoginStatus(): Promise<boolean> {
  const result = await runCommand('npx', ['clasp', 'login', '--status']);
  // clasp login --status returns 0 if logged in
  return result.code === 0 && !result.stdout.includes('not logged in');
}

export async function login(): Promise<boolean> {
  const result = await runCommand('npx', ['clasp', 'login']);
  return result.code === 0;
}

export function mapProjectTypeToClasp(type: ProjectType): string {
  // webapp uses standalone type in clasp
  if (type === 'webapp') {
    return 'standalone';
  }
  return type;
}

export async function createProject(
  type: ProjectType,
  title: string,
  cwd: string
): Promise<ClaspCreateResult> {
  const claspType = mapProjectTypeToClasp(type);
  const result = await runCommand(
    'npx',
    ['clasp', 'create', '--type', claspType, '--title', `"${title}"`],
    cwd
  );

  if (result.code === 0) {
    // Extract scriptId from output or .clasp.json
    // clasp create outputs something like "Created new standalone script"
    // The scriptId is written to .clasp.json
    return {
      success: true,
    };
  }

  // Check for specific errors
  const output = result.stdout + result.stderr;

  if (output.includes('not logged in') || output.includes('Login required')) {
    return {
      success: false,
      error: 'not_logged_in',
    };
  }

  if (output.includes('API') && output.includes('not enabled')) {
    return {
      success: false,
      error: 'api_not_enabled',
    };
  }

  return {
    success: false,
    error: 'unknown',
  };
}

export async function updateClaspJsonRootDir(projectPath: string): Promise<void> {
  const claspJsonPath = `${projectPath}/.clasp.json`;
  await updateJsonFile<ClaspJson>(claspJsonPath, (data) => ({
    ...data,
    rootDir: './dist',
  }));
}

export async function getScriptIdFromClaspJson(projectPath: string): Promise<string | undefined> {
  try {
    const { readJsonFile } = await import('./utils/fs.js');
    const data = await readJsonFile<ClaspJson>(`${projectPath}/.clasp.json`);
    return data.scriptId;
  } catch {
    return undefined;
  }
}

export function getApiEnableUrl(): string {
  return 'https://script.google.com/home/usersettings';
}
