module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'google',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 13,
    'project': './tsconfig.json',
  },
  'plugins': [
    '@typescript-eslint',
  ],
  'rules': {
  },
  'root': true,
  'env': {
    node: true,
    jest: true,
  },
};
