const { join } = require('path');

module.exports = {
  entry: {
    main: './build/src/js/main.js'
  },
  target: 'electron-renderer',
  output: {
    filename: '[name].bundle.js',
    path: join(__dirname, 'build', 'js')
  },
  mode: 'development',
  node: {
    global: false
  }
};