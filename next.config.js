const path = require('path');
const withOffline = require('next-offline');

const { i18n } = require('./next-i18next.config');

module.exports = withOffline({
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "variables.scss";`,
  },
  workboxOpts: {
    swDest: '.next/service-worker.js',
  },
  i18n,
});
