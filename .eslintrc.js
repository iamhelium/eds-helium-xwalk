module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:json/recommended',
    'plugin:xwalk/recommended',
  ],
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
    rules: {
      'import/extensions': ['error', { js: 'always' }], // require js file extensions in imports
      'linebreak-style': [0], // enforce unix linebreaks
      'no-param-reassign': [0], // allow modifying properties of param
    }
};
