import { describe, it, expect } from 'vitest';
import { generateTsconfig } from '../../src/templates/tsconfig.js';

describe('generateTsconfig', () => {
  it('should generate valid tsconfig.json content', () => {
    const content = generateTsconfig();
    const parsed = JSON.parse(content);

    expect(parsed.compilerOptions).toBeDefined();
    expect(parsed.include).toBeDefined();
  });

  it('should use ES2020 target', () => {
    const content = generateTsconfig();
    const parsed = JSON.parse(content);

    expect(parsed.compilerOptions.target).toBe('ES2020');
  });

  it('should use module None for GAS compatibility', () => {
    const content = generateTsconfig();
    const parsed = JSON.parse(content);

    expect(parsed.compilerOptions.module).toBe('None');
  });

  it('should output to dist directory', () => {
    const content = generateTsconfig();
    const parsed = JSON.parse(content);

    expect(parsed.compilerOptions.outDir).toBe('./dist');
  });

  it('should use src as root directory', () => {
    const content = generateTsconfig();
    const parsed = JSON.parse(content);

    expect(parsed.compilerOptions.rootDir).toBe('./src');
  });

  it('should include google-apps-script types', () => {
    const content = generateTsconfig();
    const parsed = JSON.parse(content);

    expect(parsed.compilerOptions.types).toContain('google-apps-script');
  });

  it('should enable strict mode', () => {
    const content = generateTsconfig();
    const parsed = JSON.parse(content);

    expect(parsed.compilerOptions.strict).toBe(true);
  });

  it('should include src/**/*', () => {
    const content = generateTsconfig();
    const parsed = JSON.parse(content);

    expect(parsed.include).toContain('src/**/*');
  });

  it('should have trailing newline', () => {
    const content = generateTsconfig();
    expect(content.endsWith('\n')).toBe(true);
  });
});
