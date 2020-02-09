module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    parser: 'babel-eslint',
    'react-native/react-native': true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
  },
  plugins: [
    'react',
    'react-native'
  ],
  rules: {
  },
};
