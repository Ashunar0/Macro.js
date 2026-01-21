import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ValidationResult } from '../types.js';

const INVALID_CHARS = /[\/\\:*?"<>|]/;
const INVALID_START = /^[._]/;

export function validateProjectName(name: string): ValidationResult {
  if (!name || name.trim() === '') {
    return {
      valid: false,
      error: 'Project name is required.',
    };
  }

  const trimmedName = name.trim();

  if (INVALID_CHARS.test(trimmedName)) {
    return {
      valid: false,
      error: 'Project name contains invalid characters.',
    };
  }

  if (INVALID_START.test(trimmedName)) {
    return {
      valid: false,
      error: 'Project name cannot start with "." or "_".',
    };
  }

  return { valid: true };
}

export function checkDirectoryExists(name: string, basePath: string = process.cwd()): boolean {
  const targetPath = resolve(basePath, name);
  return existsSync(targetPath);
}

export function validateProjectNameWithPath(
  name: string,
  basePath: string = process.cwd()
): ValidationResult {
  const nameValidation = validateProjectName(name);
  if (!nameValidation.valid) {
    return nameValidation;
  }

  if (checkDirectoryExists(name, basePath)) {
    return {
      valid: false,
      error: `Directory "${name}" already exists.`,
    };
  }

  return { valid: true };
}
