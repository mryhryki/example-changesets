import {
  getOctokit,
  Repository,
} from './octokit.js';

/**
 * @param {string} prefix
 * @returns {Promise<string | null>}
 */
export const findLatestTag = async (prefix) => {
  const octokit = getOctokit();

  for (const page of Array.from({ length: 100 }, (_, i) => i + 1)) {
    const response = await octokit.rest.repos.listReleases({
      ...Repository,
      per_page: 100,
      page,
    });
    if (response.status !== 200) {
      throw new Error(`Failed to fetch releases: ${response.status}`);
    }
    if (response.data.length === 0) {
      return null; // No releases found
    }
    const matched = response.data.find(({ tag_name, draft }) => {
      if (draft) return;
      return tag_name.startsWith(`${prefix}@v`)
    });
    if (matched != null) {
      return matched.tag_name;
    }
  }
};
