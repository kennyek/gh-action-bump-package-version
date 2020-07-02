const { Toolkit } = require('actions-toolkit');

Toolkit.run(async tools => {
  const pkg = tools.getPackageJSON();
  tools.log('Will log tools.context');
  tools.log(tools.context);
}, {
  event: 'create'
});