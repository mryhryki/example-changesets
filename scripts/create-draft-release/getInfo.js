import { valid } from 'semver';

const getReleaseBranchName = () => {
  const refType = process.env.GITHUB_REF_TYPE;
  if (refType !== 'branch') {
    throw new Error('GITHUB_REF_TYPE is not set to "branch"');
  }
  const refName = process.env.GITHUB_REF_NAME;
  if (typeof refName !== 'string' || !refName.startsWith('release/')) {
    throw new Error(`GITHUB_REF_NAME is not set or invalid: ${refName}`);
  }
  // Valid format: release/<target>/<version>
  return refName;
};

export const getTarget = () => {
  const [, target] = getReleaseBranchName().split('/');
  return target;
};

export const getNextVersion = () => {
  const branchName = getReleaseBranchName();
  const [, , version] = branchName.split('/');
  if (valid(version) == null) {
    throw new Error(`Invalid version format in GITHUB_REF_NAME: ${version}`);
  }
  return version;
};

export const getCommitHash = () => {
  const commitHash = process.env.GITHUB_SHA
  if (typeof commitHash !== 'string' || commitHash.length === 0) {
    throw new Error('GITHUB_SHA is not set or is empty');
  }
  return commitHash;
}
