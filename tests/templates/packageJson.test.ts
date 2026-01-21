import { describe, it, expect } from 'vitest';
import { generatePackageJson } from '../../src/templates/packageJson.js';

describe('generatePackageJson', () => {
  describe('TypeScript project', () => {
    it('should generate valid package.json for TypeScript', () => {
      const content = generatePackageJson({
        projectName: 'my-gas-project',
        language: 'typescript',
      });
      const parsed = JSON.parse(content);

      expect(parsed.name).toBe('my-gas-project');
      expect(parsed.version).toBe('1.0.0');
    });

    it('should include TypeScript build script', () => {
      const content = generatePackageJson({
        projectName: 'test-project',
        language: 'typescript',
      });
      const parsed = JSON.parse(content);

      expect(parsed.scripts.build).toBe('tsc && cpy src/appsscript.json dist --flat');
    });

    it('should include TypeScript devDependencies', () => {
      const content = generatePackageJson({
        projectName: 'test-project',
        language: 'typescript',
      });
      const parsed = JSON.parse(content);

      expect(parsed.devDependencies.typescript).toBeDefined();
      expect(parsed.devDependencies['@types/google-apps-script']).toBeDefined();
    });

    it('should include clasp and cpy-cli', () => {
      const content = generatePackageJson({
        projectName: 'test-project',
        language: 'typescript',
      });
      const parsed = JSON.parse(content);

      expect(parsed.devDependencies['@google/clasp']).toBeDefined();
      expect(parsed.devDependencies['cpy-cli']).toBeDefined();
    });

    it('should include deploy script', () => {
      const content = generatePackageJson({
        projectName: 'test-project',
        language: 'typescript',
      });
      const parsed = JSON.parse(content);

      expect(parsed.scripts.deploy).toBe('npm run build && npm run push');
    });
  });

  describe('JavaScript project', () => {
    it('should generate valid package.json for JavaScript', () => {
      const content = generatePackageJson({
        projectName: 'my-js-project',
        language: 'javascript',
      });
      const parsed = JSON.parse(content);

      expect(parsed.name).toBe('my-js-project');
      expect(parsed.version).toBe('1.0.0');
    });

    it('should include cpy build script for JavaScript', () => {
      const content = generatePackageJson({
        projectName: 'test-project',
        language: 'javascript',
      });
      const parsed = JSON.parse(content);

      expect(parsed.scripts.build).toBe("cpy 'src/**/*' dist --flat");
    });

    it('should NOT include TypeScript devDependencies', () => {
      const content = generatePackageJson({
        projectName: 'test-project',
        language: 'javascript',
      });
      const parsed = JSON.parse(content);

      expect(parsed.devDependencies.typescript).toBeUndefined();
      expect(parsed.devDependencies['@types/google-apps-script']).toBeUndefined();
    });

    it('should include clasp and cpy-cli', () => {
      const content = generatePackageJson({
        projectName: 'test-project',
        language: 'javascript',
      });
      const parsed = JSON.parse(content);

      expect(parsed.devDependencies['@google/clasp']).toBeDefined();
      expect(parsed.devDependencies['cpy-cli']).toBeDefined();
    });
  });

  describe('common', () => {
    it('should include push and open scripts', () => {
      const tsContent = generatePackageJson({
        projectName: 'test-project',
        language: 'typescript',
      });
      const jsContent = generatePackageJson({
        projectName: 'test-project',
        language: 'javascript',
      });

      const tsParsed = JSON.parse(tsContent);
      const jsParsed = JSON.parse(jsContent);

      expect(tsParsed.scripts.push).toBe('node scripts/push.js');
      expect(tsParsed.scripts.open).toBe('npx clasp open');
      expect(tsParsed.scripts.login).toBe('npx clasp login');
      expect(jsParsed.scripts.push).toBe('node scripts/push.js');
      expect(jsParsed.scripts.open).toBe('npx clasp open');
      expect(jsParsed.scripts.login).toBe('npx clasp login');
    });

    it('should have trailing newline', () => {
      const content = generatePackageJson({
        projectName: 'test-project',
        language: 'typescript',
      });
      expect(content.endsWith('\n')).toBe(true);
    });
  });
});
