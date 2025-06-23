import { parse } from 'semver';
import { createDraftRelease } from './create-draft-release.js';
import { findLatestTag } from './find-latest-release.js';
import { getPullRequests } from './get-pull-requests.js';
import { getTargetCommits } from './get-target-commits.js';

const main = async () => {
  const target = 'release-unit-1';
  const label = 'units/release-unit-1';
  const level = 'patch'; // or 'minor', 'major'
  const head = 'main';

  const latestTag = await findLatestTag(target);
  if (latestTag != null) {
    console.log(`Found latest tag for ${target}: ${latestTag}`);
  }

  const currentVersion = latestTag.substring(`${target}@v`.length) ?? '0.0.0';
  console.log(`Current version: ${currentVersion}`);

  const nextVersion = parse(currentVersion, {}).inc(level).toString();
  const nextTag = `${target}@v${nextVersion}`;
  console.log(`Next version: ${nextVersion}, Next tag: ${nextTag}`);

  const commits = await getTargetCommits(latestTag, head);
  console.log(`Found ${commits.length} commits between ${latestTag}...${head}`);

  const pullRequests = await getPullRequests(commits.map((commit) => commit.sha), label);
  const releaseNote = [
    'What\'s Changed',
    '',
    ...pullRequests.map((msg) => `- ${msg}`),
  ].join('\n');

  const viewUrl = await createDraftRelease({
    tagName: nextTag,
    targetCommitish: head,
    releaseName: nextTag,
    releaseBody: releaseNote,
  });
  console.log(`Draft release created or updated: ${viewUrl}`);
};

main();
