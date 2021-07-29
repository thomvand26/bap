const path = require('path');
// const withOffline = require('next-offline');

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
};
