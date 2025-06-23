import { writeFile } from 'fs/promises';

const main = async ([dirName, version]) => {
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
  await writeFile(file, yaml, 'utf8');
};

main(process.argv.slice(2));
