const path = require('path');
const wpc={
    entryExtFlag:'{we}',
    templateExtFlag:'{wtpl}',
    routeSuffixName:'html',
    webpackConfig:path.join(__dirname,'./webpack.config.js')
};
module.exports = wpc;