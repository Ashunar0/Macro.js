import { describe, it, expect } from 'vitest';
import { parseArgs, VERSION } from '../src/cli.js';

describe('parseArgs', () => {
  it('should parse with no arguments', () => {
    const { result, shouldExit } = parseArgs(['node', 'create-macro']);
    expect(shouldExit).toBe(false);
    expect(result?.projectName).toBeUndefined();
    expect(result?.options.yes).toBe(false);
  });

  it('should parse project name argument', () => {
    const { result, shouldExit } = parseArgs(['node', 'create-macro', 'my-project']);
    expect(shouldExit).toBe(false);
    expect(result?.projectName).toBe('my-project');
    expect(result?.options.yes).toBe(false);
  });

  it('should parse --yes flag', () => {
    const { result, shouldExit } = parseArgs(['node', 'create-macro', '--yes']);
    expect(shouldExit).toBe(false);
    expect(result?.options.yes).toBe(true);
  });

  it('should parse -y flag', () => {
    const { result, shouldExit } = parseArgs(['node', 'create-macro', '-y']);
    expect(shouldExit).toBe(false);
    expect(result?.options.yes).toBe(true);
  });

  it('should parse project name with --yes flag', () => {
    const { result, shouldExit } = parseArgs(['node', 'create-macro', 'my-project', '--yes']);
    expect(shouldExit).toBe(false);
    expect(result?.projectName).toBe('my-project');
    expect(result?.options.yes).toBe(true);
  });

  it('should parse --yes flag before project name', () => {
    const { result, shouldExit } = parseArgs(['node', 'create-macro', '--yes', 'my-project']);
    expect(shouldExit).toBe(false);
    expect(result?.projectName).toBe('my-project');
    expect(result?.options.yes).toBe(true);
  });

  it('should handle project name with hyphens', () => {
    const { result } = parseArgs(['node', 'create-macro', 'my-gas-project']);
    expect(result?.projectName).toBe('my-gas-project');
  });

  it('should handle project name with underscores', () => {
    const { result } = parseArgs(['node', 'create-macro', 'my_gas_project']);
    expect(result?.projectName).toBe('my_gas_project');
  });

  it('should exit for --help flag', () => {
    const { shouldExit } = parseArgs(['node', 'create-macro', '--help']);
    expect(shouldExit).toBe(true);
  });

  it('should exit for --version flag', () => {
    const { shouldExit } = parseArgs(['node', 'create-macro', '--version']);
    expect(shouldExit).toBe(true);
  });
});

describe('VERSION', () => {
  it('should be a valid version string', () => {
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });
});
