const { join } = require('path');

module.exports = {
  entry: {
    main: './output/src/js/main.js'
  },
  target: 'electron-renderer',
  output: {
    filename: '[name].bundle.js',
    path: join(__dirname, 'output', 'src', 'js')
  },
  mode: 'development',
  node: {
    global: false
  }
};