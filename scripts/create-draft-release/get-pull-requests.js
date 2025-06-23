import {
  getOctokit,
  Repository,
} from './octokit.js';

/**
 * @param {string[]} commitHashList
 * @param {string} label
 * @returns {Promise<string[]>}
 */
export const getPullRequests = async (commitHashList, label) => {
  const octokit = getOctokit();
  const results = new Map();

  for (const commitHash of commitHashList) {
    const result = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
      ...Repository,
      commit_sha: commitHash,
    });
    if (result.status !== 200) {
      throw new Error(`Failed to list pull requests for commit ${commitHash}: ${result.status} ${result.statusText}`);
    }
    for (const pr of result.data) {
      const { title, number, labels, user: { login } } = pr;
      if (labels.every(({ name }) => name !== label)) {
        continue;
      }
      if (!results.has(number)) {
        results.set(number, `${title} (#${number}) @${login}`);
      }
    }
  }

  if (results.size === 0) {
    return [];
  }

  return Array.from(results.entries()).sort(([n1], [n2]) => n2 - n1).map(([, message]) => message);
};
