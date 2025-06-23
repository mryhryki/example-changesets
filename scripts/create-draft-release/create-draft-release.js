import {
  getOctokit,
  Repository,
} from './octokit.js';

/**
 * @param {string} tagName
 * @param {string} targetCommitish
 * @param {string} releaseName
 * @param {string} releaseBody
 * @returns {Promise<string>}
 */
export const createDraftRelease = async ({ tagName, targetCommitish, releaseName, releaseBody }) => {
  const octokit = getOctokit();
  const result = await octokit.rest.repos.createRelease({
    ...Repository,
    tag_name: tagName,
    target_commitish: targetCommitish,
    name: releaseName,
    body: releaseBody,
    draft: true,
  });
  if (result.status !== 201) {
    throw new Error(`Failed to create draft release: ${result.status} ${result.statusText}`);
  }
  return result.data.html_url
};
