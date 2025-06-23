import {
  stat,
  writeFile,
} from 'fs/promises';

const getRequiredEnv = (name) => {
  const value = process.env[name];
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  throw new Error(`Environment variable ${name} is required`);
};

const main = async () => {
  const refType = getRequiredEnv('GITHUB_REF_TYPE');
  if (refType !== 'branch') {
    throw new Error(`Expected GITHUB_REF_TYPE to be 'branch', got '${refType}'`);
  }

  const refName = getRequiredEnv('GITHUB_REF_NAME');
  const names = refName.split('/');
  if (names.length !== 3) {
    throw new Error(`Expected GITHUB_REF_NAME to be in the format 'release/<dirName>/<version>', got '${refName}'`);
  }

  const [prefix, dirName, version] = names;
  if (prefix !== 'release') {
    throw new Error(`Expected GITHUB_REF_NAME to start with 'release/', got '${refName}'`);
  }

  const status = await stat(new URL(`../../units/${dirName}`, import.meta.url)).catch(() => null);
  if (status?.isDirectory() !== true) {
    throw new Error(`Directory 'units/${dirName}' does not exist`);
  }

  const yaml = [
    'include-labels:',
    `- ${dirName}`,
    `name-template: '${dirName}@v$RESOLVED_VERSION'`,
    `tag-template: '${dirName}@v$RESOLVED_VERSION'`,
    '',
    'version-resolver:',
    '  major:',
    '    labels:',
    '      - \'major\'',
    '  minor:',
    '    labels:',
    '      - \'minor\'',
    '  patch:',
    '    labels:',
    '      - \'patch\'',
    '  default: patch',
    '',
    'template: |',
    '  ## What’s Changed',
    '',
    '  $CHANGES',
  ].join('\n');

  const file = new URL('../release-drafter.yml', import.meta.url);
  console.log(`Writing release drafter YAML to ${file.pathname}`);
  console.log([
    'YAML Content:',
    '-----',
    yaml,
    '-----',
  ].join('\n'));

  await writeFile(file, yaml, 'utf8');
};

main();
