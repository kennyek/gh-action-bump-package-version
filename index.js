const { Toolkit } = require('actions-toolkit');

Toolkit.run(async tools => {
  const pkg = tools.getPackageJSON();
  const ref = tools.context.payload.ref;
  const version = ref.split('/').pop();
  const [major, minor, patch] = version.split('.');
  const [pkgMajor, pkgMinor, pkgPatch] = pkg.version.split('.');

  tools.log({
    ref,
    version,
    pkgVersion: pkg.version,
    major,
    minor,
    patch,
    pkgMajor,
    pkgMinor,
    pkgPatch
  });
}, {
  event: 'create'
});