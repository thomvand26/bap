const path = require('path');
// const withOffline = require('next-offline');

const { i18n } = require('./next-i18next.config');

// module.exports = withOffline({
//   sassOptions: {
//     includePaths: [path.join(__dirname, 'styles')],
//     prependData: `@import "variables.scss";`,
//   },
// });

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "variables.scss";`,
  },
  i18n,
};
