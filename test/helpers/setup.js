require('babel-register')({
  "babelrc": false,
  "presets": ["env", "@ava/stage-4"]
});
let browserEnv = require('browser-env');
browserEnv();