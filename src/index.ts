#!/usr/bin/env node

import * as p from '@clack/prompts';
import { parseArgs } from './cli.js';
import { promptProjectConfig, getDefaultConfig, confirmLogin, confirmRetryClaspCreate } from './prompts.js';
import { generateProject, writeClaspJson } from './generator.js';
import { validateProjectNameWithPath } from './utils/validation.js';
import { detectPackageManager, getInstallCommand, getRunCommand } from './utils/pm.js';
import { setupSignalHandlers, cleanup, disableCleanup } from './utils/cleanup.js';
import {
  checkLoginStatus,
  login,
  createProject,
  updateClaspJsonRootDir,
  getApiEnableUrl,
} from './clasp.js';
import { spawn } from 'node:child_process';
import type { ProjectConfig } from './types.js';

async function runInstall(projectPath: string, pm: ReturnType<typeof detectPackageManager>): Promise<boolean> {
  const command = getInstallCommand(pm);
  const [cmd, ...args] = command.split(' ');

  return new Promise((resolve) => {
    const proc = spawn(cmd, args, {
      cwd: projectPath,
      shell: true,
      stdio: 'inherit',
    });

    proc.on('close', (code) => {
      resolve(code === 0);
    });

    proc.on('error', () => {
      resolve(false);
    });
  });
}

async function handleClaspSetup(config: ProjectConfig, projectPath: string): Promise<void> {
  if (!config.createGasProject) {
    // Write .clasp.json with empty scriptId
    await writeClaspJson(projectPath);
    return;
  }

  // Check login status
  const isLoggedIn = await checkLoginStatus();

  if (!isLoggedIn) {
    p.log.warn("You're not logged in to clasp.");
    const shouldLogin = await confirmLogin();

    if (shouldLogin === null || !shouldLogin) {
      p.log.info('Skipping GAS project creation.');
      await writeClaspJson(projectPath);
      return;
    }

    const loginSuccess = await login();
    if (!loginSuccess) {
      p.log.warn('Login failed. Skipping GAS project creation.');
      await writeClaspJson(projectPath);
      return;
    }
  }

  // Try to create project
  let createResult = await createProject(config.projectType, config.projectName, projectPath);

  // Handle API not enabled error
  if (!createResult.success && createResult.error === 'api_not_enabled') {
    p.log.error('Google Apps Script API is not enabled.');
    p.log.info(`To enable it:\n1. Visit: ${getApiEnableUrl()}\n2. Turn on "Google Apps Script API"`);

    const shouldRetry = await confirmRetryClaspCreate();
    if (shouldRetry === null || !shouldRetry) {
      p.log.info('Skipping GAS project creation.');
      await writeClaspJson(projectPath);
      return;
    }

    createResult = await createProject(config.projectType, config.projectName, projectPath);
  }

  if (!createResult.success) {
    p.log.warn('Failed to create GAS project. You can create it later with `clasp create`.');
    await writeClaspJson(projectPath);
    return;
  }

  // Update .clasp.json with rootDir
  await updateClaspJsonRootDir(projectPath);
  p.log.success('Created GAS project.');
}

async function main(): Promise<void> {
  setupSignalHandlers();

  const { projectName: argProjectName, options } = parseArgs(process.argv);

  let config: ProjectConfig;

  if (options.yes) {
    // Non-interactive mode
    const name = argProjectName || 'my-gas-project';
    const validation = validateProjectNameWithPath(name);
    if (!validation.valid) {
      p.log.error(validation.error!);
      process.exit(1);
    }
    config = getDefaultConfig(name);
  } else {
    // Interactive mode
    const result = await promptProjectConfig({
      defaultName: argProjectName,
    });

    if (!result) {
      process.exit(0);
    }

    // Validate directory doesn't exist
    const validation = validateProjectNameWithPath(result.projectName);
    if (!validation.valid) {
      p.log.error(validation.error!);
      process.exit(1);
    }

    config = result;
  }

  // Generate project
  const s = p.spinner();
  s.start('Creating project...');

  let projectPath: string;
  try {
    projectPath = await generateProject(config);
    s.stop('Project created.');
  } catch (error) {
    s.stop('Failed to create project.');
    await cleanup();
    throw error;
  }

  // Disable cleanup after successful project generation
  disableCleanup();

  // Handle clasp setup
  await handleClaspSetup(config, projectPath);

  // Install dependencies
  const pm = detectPackageManager();
  s.start('Installing dependencies...');

  const installSuccess = await runInstall(projectPath, pm);
  if (installSuccess) {
    s.stop('Dependencies installed.');
  } else {
    s.stop('Failed to install dependencies. You can install them manually.');
  }

  // Show completion message
  const runCmd = getRunCommand(pm, 'build');
  const pushCmd = getRunCommand(pm, 'push');

  p.outro(`Done! Now run:
  cd ${config.projectName}
  ${runCmd}
  ${pushCmd}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
