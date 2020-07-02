const { Toolkit } = require('actions-toolkit');

Toolkit.run(async tools => {
  const pkg = tools.getPackageJSON();
  const ref = tools.context.payload.ref;
  const version = ref.split('/').pop();
  const [major, minor, patch] = version.split('.');
  const [pkgMajor, pkgMinor, pkgPatch] = pkg.version.split('.');
  const newPkgVersion = getNewPkgVersion(version, pkgVersion);

  tools.log({
    ref,
    version,
    pkgVersion: pkg.version,
    major,
    minor,
    patch,
    pkgMajor,
    pkgMinor,
    pkgPatch,
    newPkgVersion
  });
}, {
  event: 'create'
});

function getNewPkgVersion(version, pkgVersion) {
  const [major, minor, patch] = version.split('.');
  const [pkgMajor, pkgMinor, pkgPatch] = pkg.version.split('.');

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
