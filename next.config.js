const path = require('path');
const withPWA = require('next-pwa');

const { i18n } = require('./next-i18next.config');

module.exports = withPWA({
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "variables.scss";`,
  },
  pwa: {
    dest: 'public',
  },
  i18n,
});
