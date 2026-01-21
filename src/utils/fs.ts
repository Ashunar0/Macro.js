import { mkdir, writeFile as fsWriteFile, readFile, rm } from 'node:fs/promises';
import { dirname } from 'node:path';

export async function writeFile(filePath: string, content: string): Promise<void> {
  const dir = dirname(filePath);
  await mkdir(dir, { recursive: true });
  await fsWriteFile(filePath, content, 'utf-8');
}

export async function readJsonFile<T>(filePath: string): Promise<T> {
  const content = await readFile(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

export async function updateJsonFile<T>(
  filePath: string,
  updater: (data: T) => T
): Promise<void> {
  const data = await readJsonFile<T>(filePath);
  const updatedData = updater(data);
  await fsWriteFile(filePath, JSON.stringify(updatedData, null, 2) + '\n', 'utf-8');
}

export async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true });
}

export async function removeDir(dirPath: string): Promise<void> {
  await rm(dirPath, { recursive: true, force: true });
}
