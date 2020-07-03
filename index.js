const { Toolkit } = require('actions-toolkit');
const fs = require('fs');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const path = require('path');

const gitData = {
  repo: process.env.GITHUB_REPOSITORY,
  username: process.env.USERNAME,
  token: process.env.PASSWORD,
  dir: process.env.HOME,
  message: 'Package version updated through GitHub Action'
};

Toolkit.run(async tools => {
  const pkg = tools.getPackageJSON();
  const ref = tools.context.payload.ref;
  const version = ref.split('/').pop();
  const newPkgVersion = getNewPkgVersion(version, pkg.version);

  updateVersionOnGitHub(ref, newPkgVersion, pkg);
}, {
  event: 'create'
});

function getNewPkgVersion(version, pkgVersion) {
  const [major, minor, patch] = version.split('.');
  const [pkgMajor, pkgMinor, pkgPatch] = pkgVersion.split('.');

  const newVersion = {
    major: `${Number(pkgMajor) + 1}.0.0`,
    minor: `${pkgMajor}.${Number(pkgMinor) + 1}.0`,
    patch: `${pkgMajor}.${pkgMinor}.${Number(pkgPatch) + 1}`
  };

  if (minor === '0' && patch === '0') {
    return newVersion.major;
  } else if (patch === '0') {
    return newVersion.minor;
  } else {
    return newVersion.patch;
  }
}

async function updateVersionOnGitHub(ref, newPkgVersion, pkg) {
  const url = `https://github.com/${gitData.repo}`;

  await gitClone(url, ref);
  await updatePackageVersion(pkg, newPkgVersion);
  await gitAddAll();
  await gitCommit();
  await gitPush();
}

async function gitClone(url, ref) {
  const { dir } = gitData;

  await git.clone({
    fs,
    http,
    dir,
    url,
    ref,
    corsProxy: 'https://cors.isomorphic-git.org',
    onAuth,
    singleBranch: true,
    depth: 1
  });
}

async function updatePackageVersion(pkg, newPkgVersion) {
  const { dir } = gitData;

  const pkgLock = await new Promise((resolve, reject) => {
    fs.readFile(
      path.resolve(dir, 'package-lock.json'),
      'utf8',
      (readError, file) => (readError ? reject(readError) : resolve(file))
    )
  });

  const newPkg = Object.assign({}, pkg);
  const newPkgLock = Object.assign({}, pkgLock);
  newPkg.version = newPkgVersion;
  newPkgLock.version = newPkgVersion;

  await new Promise((resolve, reject) => {
    fs.writeFile(
      path.resolve(dir, 'package.json'),
      JSON.stringify(newPkg, null, 2),
      writeError => (writeError ? reject(writeError) : resolve())
    )
  });
  await new Promise((resolve, reject) => {
    fs.writeFile(
      path.resolve(dir, 'package-lock.json'),
      JSON.stringify(newPkgLock, null, 2),
      writeError => (writeError ? reject(writeError) : resolve())
    )
  });
}

async function gitAddAll() {
  const { dir } = gitData;

  const repo = {
    fs,
    dir
  };

  const status = await git.statusMatrix(repo);
  await Promise.all(status.map(
    ([filepath, worktreeStatus]) => (worktreeStatus ? git.add({ ...repo, filepath }) : git.remove({ ...repo, filepath }))
  ));
}

async function gitCommit() {
  const { dir, message } = gitData;

  await git.commit({
    fs,
    dir,
    author: { name: 'Bump Package Version Action' },
    message
  });
}

async function gitPush(ref) {
  const { dir } = gitData;

  await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref,
    onAuth
  });
}

function onAuth() {
  const { token, username } = gitData;

  return {
    username,
    password: token
  };
}
