import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { mkdir, rm, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const CLI_PATH = join(process.cwd(), 'dist', 'index.js');

function runCLI(args: string[], cwd: string): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    const proc = spawn('node', [CLI_PATH, ...args], {
      cwd,
      env: { ...process.env, NO_COLOR: '1' },
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

    proc.on('error', (err) => {
      stderr += err.message;
      resolve({ stdout, stderr, code: 1 });
    });
  });
}

describe('E2E: CLI', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `create-macro-e2e-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it('should show version with --version flag', async () => {
    const result = await runCLI(['--version'], testDir);
    // cac outputs: create-macro/0.1.0 darwin-arm64 node-vX.X.X
    expect(result.stdout.trim()).toMatch(/^create-macro\/\d+\.\d+\.\d+/);
    expect(result.code).toBe(0);
  });

  it('should show help with --help flag', async () => {
    const result = await runCLI(['--help'], testDir);
    expect(result.stdout).toContain('create-macro');
    expect(result.stdout).toContain('--yes');
    expect(result.code).toBe(0);
  });
});

describe('E2E: Project generation with --yes', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `create-macro-e2e-gen-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it('should create project with --yes flag (skip clasp and install)', async () => {
    // This test creates a project but skips clasp setup and npm install
    // by using --yes which sets createGasProject to true by default
    // The clasp commands will fail (not logged in), but project files should be created

    const projectName = 'test-project';
    const projectPath = join(testDir, projectName);

    // Run with timeout since npm install might take time or fail
    const result = await runCLI([projectName, '--yes'], testDir);

    // Check that project directory was created
    expect(existsSync(projectPath)).toBe(true);

    // Check that required files exist
    expect(existsSync(join(projectPath, 'package.json'))).toBe(true);
    expect(existsSync(join(projectPath, 'tsconfig.json'))).toBe(true);
    expect(existsSync(join(projectPath, 'src', 'main.ts'))).toBe(true);
    expect(existsSync(join(projectPath, 'src', 'appsscript.json'))).toBe(true);
    expect(existsSync(join(projectPath, '.gitignore'))).toBe(true);
    expect(existsSync(join(projectPath, '.clasp.json'))).toBe(true);

    // Verify package.json content
    const packageJson = JSON.parse(await readFile(join(projectPath, 'package.json'), 'utf-8'));
    expect(packageJson.name).toBe(projectName);
    expect(packageJson.devDependencies['@google/clasp']).toBeDefined();
    expect(packageJson.devDependencies.typescript).toBeDefined();

    // Verify tsconfig.json content
    const tsconfig = JSON.parse(await readFile(join(projectPath, 'tsconfig.json'), 'utf-8'));
    expect(tsconfig.compilerOptions.module).toBe('None');

    // Verify .clasp.json has rootDir
    const claspJson = JSON.parse(await readFile(join(projectPath, '.clasp.json'), 'utf-8'));
    expect(claspJson.rootDir).toBe('./dist');
  }, 60000); // 60 second timeout for npm install

  it('should fail for invalid project name', async () => {
    const result = await runCLI(['.invalid-name', '--yes'], testDir);
    expect(result.code).toBe(1);
  });

  it('should fail if directory already exists', async () => {
    const projectName = 'existing-project';
    await mkdir(join(testDir, projectName));

    const result = await runCLI([projectName, '--yes'], testDir);
    expect(result.code).toBe(1);
  });
});
