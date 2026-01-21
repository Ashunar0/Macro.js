import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectPackageManager, getInstallCommand, getRunCommand } from '../../src/utils/pm.js';

describe('detectPackageManager', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should detect npm', () => {
    process.env.npm_config_user_agent = 'npm/10.2.0 node/v20.10.0 darwin x64';
    expect(detectPackageManager()).toBe('npm');
  });

  it('should detect yarn', () => {
    process.env.npm_config_user_agent = 'yarn/1.22.19 npm/? node/v20.10.0 darwin x64';
    expect(detectPackageManager()).toBe('yarn');
  });

  it('should detect pnpm', () => {
    process.env.npm_config_user_agent = 'pnpm/8.14.0 npm/? node/v20.10.0 darwin x64';
    expect(detectPackageManager()).toBe('pnpm');
  });

  it('should detect bun', () => {
    process.env.npm_config_user_agent = 'bun/1.0.0 node/v20.10.0 darwin x64';
    expect(detectPackageManager()).toBe('bun');
  });

  it('should default to npm when user agent is not set', () => {
    delete process.env.npm_config_user_agent;
    expect(detectPackageManager()).toBe('npm');
  });

  it('should default to npm for unknown user agent', () => {
    process.env.npm_config_user_agent = 'unknown/1.0.0';
    expect(detectPackageManager()).toBe('npm');
  });
});

describe('getInstallCommand', () => {
  it('should return correct command for npm', () => {
    expect(getInstallCommand('npm')).toBe('npm install');
  });

  it('should return correct command for yarn', () => {
    expect(getInstallCommand('yarn')).toBe('yarn');
  });

  it('should return correct command for pnpm', () => {
    expect(getInstallCommand('pnpm')).toBe('pnpm install');
  });

  it('should return correct command for bun', () => {
    expect(getInstallCommand('bun')).toBe('bun install');
  });
});

describe('getRunCommand', () => {
  it('should return correct command for npm', () => {
    expect(getRunCommand('npm', 'build')).toBe('npm run build');
    expect(getRunCommand('npm', 'push')).toBe('npm run push');
  });

  it('should return correct command for yarn', () => {
    expect(getRunCommand('yarn', 'build')).toBe('yarn build');
    expect(getRunCommand('yarn', 'push')).toBe('yarn push');
  });

  it('should return correct command for pnpm', () => {
    expect(getRunCommand('pnpm', 'build')).toBe('pnpm build');
    expect(getRunCommand('pnpm', 'push')).toBe('pnpm push');
  });

  it('should return correct command for bun', () => {
    expect(getRunCommand('bun', 'build')).toBe('bun run build');
    expect(getRunCommand('bun', 'push')).toBe('bun run push');
  });
});
