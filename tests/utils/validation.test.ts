import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateProjectName, checkDirectoryExists, validateProjectNameWithPath } from '../../src/utils/validation.js';
import { existsSync } from 'node:fs';

vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
}));

describe('validateProjectName', () => {
  it('should return valid for a valid project name', () => {
    const result = validateProjectName('my-project');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should return valid for project name with numbers', () => {
    const result = validateProjectName('my-project-123');
    expect(result.valid).toBe(true);
  });

  it('should return error for empty string', () => {
    const result = validateProjectName('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Project name is required.');
  });

  it('should return error for whitespace only', () => {
    const result = validateProjectName('   ');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Project name is required.');
  });

  it('should return error for name with forward slash', () => {
    const result = validateProjectName('my/project');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Project name contains invalid characters.');
  });

  it('should return error for name with backslash', () => {
    const result = validateProjectName('my\\project');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Project name contains invalid characters.');
  });

  it('should return error for name with colon', () => {
    const result = validateProjectName('my:project');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Project name contains invalid characters.');
  });

  it('should return error for name with asterisk', () => {
    const result = validateProjectName('my*project');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Project name contains invalid characters.');
  });

  it('should return error for name with question mark', () => {
    const result = validateProjectName('my?project');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Project name contains invalid characters.');
  });

  it('should return error for name with double quotes', () => {
    const result = validateProjectName('my"project');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Project name contains invalid characters.');
  });

  it('should return error for name with angle brackets', () => {
    const result = validateProjectName('my<project>');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Project name contains invalid characters.');
  });

  it('should return error for name with pipe', () => {
    const result = validateProjectName('my|project');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Project name contains invalid characters.');
  });

  it('should return error for name starting with dot', () => {
    const result = validateProjectName('.my-project');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Project name cannot start with "." or "_".');
  });

  it('should return error for name starting with underscore', () => {
    const result = validateProjectName('_my-project');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Project name cannot start with "." or "_".');
  });

  it('should allow hyphens in the middle', () => {
    const result = validateProjectName('my-gas-project');
    expect(result.valid).toBe(true);
  });

  it('should allow underscores in the middle', () => {
    const result = validateProjectName('my_gas_project');
    expect(result.valid).toBe(true);
  });
});

describe('checkDirectoryExists', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return true if directory exists', () => {
    vi.mocked(existsSync).mockReturnValue(true);
    const result = checkDirectoryExists('existing-dir', '/base');
    expect(result).toBe(true);
    expect(existsSync).toHaveBeenCalledWith('/base/existing-dir');
  });

  it('should return false if directory does not exist', () => {
    vi.mocked(existsSync).mockReturnValue(false);
    const result = checkDirectoryExists('new-dir', '/base');
    expect(result).toBe(false);
    expect(existsSync).toHaveBeenCalledWith('/base/new-dir');
  });
});

describe('validateProjectNameWithPath', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return valid when name is valid and directory does not exist', () => {
    vi.mocked(existsSync).mockReturnValue(false);
    const result = validateProjectNameWithPath('my-project', '/base');
    expect(result.valid).toBe(true);
  });

  it('should return error when name is invalid', () => {
    const result = validateProjectNameWithPath('.invalid', '/base');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Project name cannot start with "." or "_".');
  });

  it('should return error when directory exists', () => {
    vi.mocked(existsSync).mockReturnValue(true);
    const result = validateProjectNameWithPath('existing-project', '/base');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Directory "existing-project" already exists.');
  });
});
