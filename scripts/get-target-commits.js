import {
  getOctokit,
  Repository,
} from './octokit.js';

/**
 * @param {string} base
 * @param {string} head
 * @returns {Promise<Array>}
 */
export const getTargetCommits = async (base, head) => {
  const result = await getOctokit().rest.repos.compareCommits({
    ...Repository,
    base,
    head,
  });
  if (result.status !== 200) {
    throw new Error(`Failed to compare commits: ${result.status} ${result.statusText}`);
  }
  return result.data.commits;
};
