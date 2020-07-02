const { Toolkit } = require('actions-toolkit');

Toolkit.run(async tools => {
  const pkg = tools.getPackageJSON();
  tools.log(JSON.stringify(tools.context.event, null, 2));
}, {
  event: 'create'
});