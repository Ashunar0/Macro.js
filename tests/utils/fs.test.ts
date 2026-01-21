import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeFile, readJsonFile, updateJsonFile, ensureDir, removeDir } from '../../src/utils/fs.js';
import { existsSync } from 'node:fs';
import { readFile, rm, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

describe('fs utilities', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `create-macro-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe('writeFile', () => {
    it('should create file and parent directories', async () => {
      const filePath = join(testDir, 'nested', 'dir', 'file.txt');
      await writeFile(filePath, 'hello world');

      expect(existsSync(filePath)).toBe(true);
      const content = await readFile(filePath, 'utf-8');
      expect(content).toBe('hello world');
    });

    it('should overwrite existing file', async () => {
      const filePath = join(testDir, 'file.txt');
      await writeFile(filePath, 'first');
      await writeFile(filePath, 'second');

      const content = await readFile(filePath, 'utf-8');
      expect(content).toBe('second');
    });
  });

  describe('readJsonFile', () => {
    it('should read and parse JSON file', async () => {
      const filePath = join(testDir, 'data.json');
      await writeFile(filePath, '{"name": "test", "value": 42}');

      const data = await readJsonFile<{ name: string; value: number }>(filePath);
      expect(data.name).toBe('test');
      expect(data.value).toBe(42);
    });

    it('should throw error for invalid JSON', async () => {
      const filePath = join(testDir, 'invalid.json');
      await writeFile(filePath, 'not json');

      await expect(readJsonFile(filePath)).rejects.toThrow();
    });
  });

  describe('updateJsonFile', () => {
    it('should update JSON file', async () => {
      const filePath = join(testDir, 'config.json');
      await writeFile(filePath, '{"count": 1}');

      await updateJsonFile<{ count: number }>(filePath, (data) => ({
        ...data,
        count: data.count + 1,
      }));

      const data = await readJsonFile<{ count: number }>(filePath);
      expect(data.count).toBe(2);
    });

    it('should add new properties', async () => {
      const filePath = join(testDir, 'config.json');
      await writeFile(filePath, '{"existing": true}');

      await updateJsonFile<{ existing: boolean; newProp?: string }>(filePath, (data) => ({
        ...data,
        newProp: 'added',
      }));

      const data = await readJsonFile<{ existing: boolean; newProp: string }>(filePath);
      expect(data.existing).toBe(true);
      expect(data.newProp).toBe('added');
    });
  });

  describe('ensureDir', () => {
    it('should create directory', async () => {
      const dirPath = join(testDir, 'new-dir');
      await ensureDir(dirPath);

      expect(existsSync(dirPath)).toBe(true);
    });

    it('should create nested directories', async () => {
      const dirPath = join(testDir, 'a', 'b', 'c');
      await ensureDir(dirPath);

      expect(existsSync(dirPath)).toBe(true);
    });

    it('should not throw if directory exists', async () => {
      const dirPath = join(testDir, 'existing');
      await mkdir(dirPath);

      await expect(ensureDir(dirPath)).resolves.not.toThrow();
    });
  });

  describe('removeDir', () => {
    it('should remove directory and contents', async () => {
      const dirPath = join(testDir, 'to-remove');
      await mkdir(dirPath);
      await writeFile(join(dirPath, 'file.txt'), 'content');

      await removeDir(dirPath);

      expect(existsSync(dirPath)).toBe(false);
    });

    it('should not throw if directory does not exist', async () => {
      const dirPath = join(testDir, 'non-existent');

      await expect(removeDir(dirPath)).resolves.not.toThrow();
    });
  });
});
