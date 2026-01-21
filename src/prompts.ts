import * as p from '@clack/prompts';
import type { ProjectConfig, Language, ProjectType } from './types.js';
import { validateProjectName } from './utils/validation.js';

export const DEFAULT_PROJECT_NAME = 'my-gas-project';
export const DEFAULT_LANGUAGE: Language = 'typescript';
export const DEFAULT_CREATE_GAS = true;
export const DEFAULT_PROJECT_TYPE: ProjectType = 'standalone';

export interface PromptOptions {
  defaultName?: string;
  skipNamePrompt?: boolean;
}

export async function promptProjectConfig(options: PromptOptions = {}): Promise<ProjectConfig | null> {
  const { defaultName = DEFAULT_PROJECT_NAME, skipNamePrompt = false } = options;

  p.intro('Create a new GAS project');

  let projectName: string;

  if (skipNamePrompt && defaultName) {
    // Use the provided name without prompting
    projectName = defaultName;
  } else {
    const result = await p.text({
      message: 'Project name',
      placeholder: defaultName,
      defaultValue: defaultName,
      validate: (value) => {
        const validationResult = validateProjectName(value);
        if (!validationResult.valid) {
          return validationResult.error;
        }
      },
    });

    if (p.isCancel(result)) {
      p.cancel('Operation cancelled.');
      return null;
    }

    projectName = result as string;
  }

  const language = await p.select({
    message: 'Select language',
    options: [
      { value: 'typescript', label: 'TypeScript' },
      { value: 'javascript', label: 'JavaScript' },
    ],
    initialValue: DEFAULT_LANGUAGE,
  });

  if (p.isCancel(language)) {
    p.cancel('Operation cancelled.');
    return null;
  }

  const createGasProject = await p.confirm({
    message: 'Create new GAS project?',
    initialValue: DEFAULT_CREATE_GAS,
  });

  if (p.isCancel(createGasProject)) {
    p.cancel('Operation cancelled.');
    return null;
  }

  const projectType = await p.select({
    message: 'Select project type',
    options: [
      { value: 'standalone', label: 'Standalone', hint: 'Generic script' },
      { value: 'sheets', label: 'Sheets', hint: 'Spreadsheet add-on' },
      { value: 'docs', label: 'Docs', hint: 'Document add-on' },
      { value: 'forms', label: 'Forms', hint: 'Form add-on' },
      { value: 'slides', label: 'Slides', hint: 'Slides add-on' },
      { value: 'webapp', label: 'Web App', hint: 'doGet/doPost handlers' },
    ],
    initialValue: DEFAULT_PROJECT_TYPE,
  });

  if (p.isCancel(projectType)) {
    p.cancel('Operation cancelled.');
    return null;
  }

  return {
    projectName: projectName as string,
    language: language as Language,
    createGasProject: createGasProject as boolean,
    projectType: projectType as ProjectType,
  };
}

export async function confirmLogin(): Promise<boolean | null> {
  const result = await p.confirm({
    message: 'Login now?',
    initialValue: true,
  });

  if (p.isCancel(result)) {
    return null;
  }

  return result as boolean;
}

export async function confirmRetryClaspCreate(): Promise<boolean | null> {
  const result = await p.confirm({
    message: 'Retry clasp create?',
    initialValue: true,
  });

  if (p.isCancel(result)) {
    return null;
  }

  return result as boolean;
}

export function getDefaultConfig(projectName: string = DEFAULT_PROJECT_NAME): ProjectConfig {
  return {
    projectName,
    language: DEFAULT_LANGUAGE,
    createGasProject: DEFAULT_CREATE_GAS,
    projectType: DEFAULT_PROJECT_TYPE,
  };
}
