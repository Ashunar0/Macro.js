import { describe, it, expect } from 'vitest';
import { generateAppsscript } from '../../src/templates/appsscript.js';
import { generateGitignore } from '../../src/templates/gitignore.js';
import { generateClaspJson } from '../../src/templates/clasp.js';

describe('generateAppsscript', () => {
  it('should generate valid appsscript.json content', () => {
    const content = generateAppsscript();
    const parsed = JSON.parse(content);

    expect(parsed.timeZone).toBe('Asia/Tokyo');
    expect(parsed.dependencies).toEqual({});
    expect(parsed.exceptionLogging).toBe('STACKDRIVER');
    expect(parsed.runtimeVersion).toBe('V8');
  });

  it('should have trailing newline', () => {
    const content = generateAppsscript();
    expect(content.endsWith('\n')).toBe(true);
  });
});

describe('generateGitignore', () => {
  it('should include node_modules', () => {
    const content = generateGitignore();
    expect(content).toContain('node_modules/');
  });

  it('should include dist', () => {
    const content = generateGitignore();
    expect(content).toContain('dist/');
  });

  it('should include .clasprc.json', () => {
    const content = generateGitignore();
    expect(content).toContain('.clasprc.json');
  });

  it('should have trailing newline', () => {
    const content = generateGitignore();
    expect(content.endsWith('\n')).toBe(true);
  });
});

describe('generateClaspJson', () => {
  it('should generate with empty scriptId by default', () => {
    const content = generateClaspJson();
    const parsed = JSON.parse(content);

    expect(parsed.scriptId).toBe('');
    expect(parsed.rootDir).toBe('./dist');
  });

  it('should use provided scriptId', () => {
    const content = generateClaspJson({ scriptId: 'abc123' });
    const parsed = JSON.parse(content);

    expect(parsed.scriptId).toBe('abc123');
  });

  it('should have trailing newline', () => {
    const content = generateClaspJson();
    expect(content.endsWith('\n')).toBe(true);
  });
});
