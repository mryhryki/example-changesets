import { Octokit } from '@octokit/rest';

export const Repository = {
  owner: 'mryhryki',
  repo: 'example-release-workflow',
};

export const getOctokit = () => {
  const token = process.env.GITHUB_TOKEN;
  if (typeof token !== 'string' || token.length === 0) {
    throw new Error('GITHUB_TOKEN is not set or is empty');
  }
  return new Octokit({ auth: token });
};
