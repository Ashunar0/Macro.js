import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  mapProjectTypeToClasp,
  getApiEnableUrl,
  updateClaspJsonRootDir,
  getScriptIdFromClaspJson,
} from '../src/clasp.js';
import { writeFile, ensureDir, removeDir } from '../src/utils/fs.js';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { readFile } from 'node:fs/promises';

describe('mapProjectTypeToClasp', () => {
  it('should map standalone to standalone', () => {
    expect(mapProjectTypeToClasp('standalone')).toBe('standalone');
  });

  it('should map sheets to sheets', () => {
    expect(mapProjectTypeToClasp('sheets')).toBe('sheets');
  });

  it('should map docs to docs', () => {
    expect(mapProjectTypeToClasp('docs')).toBe('docs');
  });

  it('should map forms to forms', () => {
    expect(mapProjectTypeToClasp('forms')).toBe('forms');
  });

  it('should map slides to slides', () => {
    expect(mapProjectTypeToClasp('slides')).toBe('slides');
  });

  it('should map webapp to standalone', () => {
    expect(mapProjectTypeToClasp('webapp')).toBe('standalone');
  });
});

describe('getApiEnableUrl', () => {
  it('should return correct URL', () => {
    expect(getApiEnableUrl()).toBe('https://script.google.com/home/usersettings');
  });
});

describe('updateClaspJsonRootDir', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `create-macro-clasp-test-${Date.now()}`);
    await ensureDir(testDir);
  });

  afterEach(async () => {
    await removeDir(testDir);
  });

  it('should add rootDir to existing .clasp.json', async () => {
    const claspJson = { scriptId: 'abc123' };
    await writeFile(join(testDir, '.clasp.json'), JSON.stringify(claspJson, null, 2));

    await updateClaspJsonRootDir(testDir);

    const content = await readFile(join(testDir, '.clasp.json'), 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed.scriptId).toBe('abc123');
    expect(parsed.rootDir).toBe('./dist');
  });

  it('should preserve existing properties', async () => {
    const claspJson = { scriptId: 'abc123', parentId: ['xyz'] };
    await writeFile(join(testDir, '.clasp.json'), JSON.stringify(claspJson, null, 2));

    await updateClaspJsonRootDir(testDir);

    const content = await readFile(join(testDir, '.clasp.json'), 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed.scriptId).toBe('abc123');
    expect(parsed.parentId).toEqual(['xyz']);
    expect(parsed.rootDir).toBe('./dist');
  });
});

describe('getScriptIdFromClaspJson', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `create-macro-clasp-read-test-${Date.now()}`);
    await ensureDir(testDir);
  });

  afterEach(async () => {
    await removeDir(testDir);
  });

  it('should return scriptId from .clasp.json', async () => {
    const claspJson = { scriptId: 'test-script-id' };
    await writeFile(join(testDir, '.clasp.json'), JSON.stringify(claspJson, null, 2));

    const scriptId = await getScriptIdFromClaspJson(testDir);
    expect(scriptId).toBe('test-script-id');
  });

  it('should return undefined if file does not exist', async () => {
    const scriptId = await getScriptIdFromClaspJson(testDir);
    expect(scriptId).toBeUndefined();
  });
});
