import { createDraftRelease } from './create-draft-release.js';
import { findLatestTag } from './find-latest-release.js';
import { getPullRequests } from './get-pull-requests.js';
import { getTargetCommits } from './get-target-commits.js';
import {
  getCommitHash,
  getNextVersion,
  getTarget,
} from './getInfo.js';

const main = async () => {
  // e.g. 'release-unit-1
  const target = getTarget();
  // e.g. 'v1.2.3
  const nextVersion = getNextVersion();
  const head = getCommitHash();
  console.log(`Target: ${target}, Next Version: ${nextVersion}, Head: ${head}`);

  const latestTag = await findLatestTag(target);
  if (latestTag != null) {
    console.log(`Found latest tag for ${target}: ${latestTag}`);
  }

  const currentVersion = latestTag?.substring(`${target}@`.length) ?? 'v0.0.0';
  console.log(`Current version: ${currentVersion}`);

  const nextTag = `${target}@${nextVersion}`;
  console.log(`Next version: ${nextVersion}, Next tag: ${nextTag}`);

  const commits = await getTargetCommits(latestTag, head);
  console.log(`Found ${commits.length} commits between ${latestTag}...${head}`);

  const pullRequests = await getPullRequests(commits.map((commit) => commit.sha), target);
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

  // TODO: Delete same name draft releases
};

main();
