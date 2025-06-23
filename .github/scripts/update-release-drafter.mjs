import {
  readFile,
  writeFile,
} from 'fs/promises';

const main = async () => {
  const file = new URL('../release-drafter.yml', import.meta.url);
  const baseContent = await readFile(file, 'utf8');

  const yaml = [
    'include-labels:',
    '- release-unit-1',
    '',
    baseContent,
  ].join('\n');

  await writeFile(file, yaml, 'utf8');
};

main();
