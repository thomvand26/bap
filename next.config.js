const path = require('path');
const { SETTINGS, SETTINGS_ACCOUNT } = require('./routes');

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "variables.scss";`,
  },
  async redirects() {
    return [
      {
        source: SETTINGS,
        destination: SETTINGS_ACCOUNT,
        permanent: true,
      },
    ];
  },
};
