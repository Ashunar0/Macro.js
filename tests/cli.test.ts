import { describe, it, expect } from 'vitest';
import { parseArgs, VERSION } from '../src/cli.js';

describe('parseArgs', () => {
  it('should parse with no arguments', () => {
    const result = parseArgs(['node', 'create-macro']);
    expect(result.projectName).toBeUndefined();
    expect(result.options.yes).toBe(false);
  });

  it('should parse project name argument', () => {
    const result = parseArgs(['node', 'create-macro', 'my-project']);
    expect(result.projectName).toBe('my-project');
    expect(result.options.yes).toBe(false);
  });

  it('should parse --yes flag', () => {
    const result = parseArgs(['node', 'create-macro', '--yes']);
    expect(result.options.yes).toBe(true);
  });

  it('should parse -y flag', () => {
    const result = parseArgs(['node', 'create-macro', '-y']);
    expect(result.options.yes).toBe(true);
  });

  it('should parse project name with --yes flag', () => {
    const result = parseArgs(['node', 'create-macro', 'my-project', '--yes']);
    expect(result.projectName).toBe('my-project');
    expect(result.options.yes).toBe(true);
  });

  it('should parse --yes flag before project name', () => {
    const result = parseArgs(['node', 'create-macro', '--yes', 'my-project']);
    expect(result.projectName).toBe('my-project');
    expect(result.options.yes).toBe(true);
  });

  it('should handle project name with hyphens', () => {
    const result = parseArgs(['node', 'create-macro', 'my-gas-project']);
    expect(result.projectName).toBe('my-gas-project');
  });

  it('should handle project name with underscores', () => {
    const result = parseArgs(['node', 'create-macro', 'my_gas_project']);
    expect(result.projectName).toBe('my_gas_project');
  });
});

describe('VERSION', () => {
  it('should be a valid version string', () => {
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });
});
