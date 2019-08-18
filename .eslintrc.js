module.exports = {
    'env': {
        'browser': true,
        'es6': true,
        'node': true,
        'mocha': true
    },
    'extends': [
        'google'
    ],
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    rules: {
      'linebreak-style': ['warn', 'windows'],
      'semi': ['error', 'never'],
      'space-before-function-paren': ['warn', 'always'],
      'require-jsdoc': 0,
      'valid-jsdoc': 0,
      'arrow-parens': 0,
      'max-len': ['warn', 120],
    }
}
