'use strict';
const {OpenShiftClientX} = require('pipeline-cli')
const path = require('path');

module.exports = (settings) => {
  const phases = settings.phases
  const options = settings.options
  const oc = new OpenShiftClientX(Object.assign({'namespace':phases.build.namespace}, options));
  const phase='build'
  let objects = []
  const templatesLocalBaseUrl =oc.toFileUrl(path.resolve(__dirname, '../../openshift'))

  // The building of your cool app goes here ▼▼▼
  objects.push(...oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/app.bc.yaml`, {
    'param':{
      'NAME': phases[phase].name,
      'SOURCE_REPOSITORY_URL': 'https://github.com/plasticviking/range-web.git',
      'SOURCE_REPOSITORY_REF': 'dev',     
    }
  }));

  console.log(`${JSON.stringify(objects, null, 2)}`);
  oc.applyAndBuild(objects)
}

