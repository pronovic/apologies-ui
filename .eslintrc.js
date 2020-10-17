 module.exports = {
      root: true,
      env: {
        node: true
      },
      "plugins": ["jest"],
      'extends': [
        'standard',
        'plugin:vue/essential',
        'plugin:prettier/recommended',
        '@vue/prettier',
        "plugin:jest/recommended",
        "plugin:jest/style",
        "plugin:cypress/recommended"
      ],
      parserOptions: {
        parser: 'babel-eslint'
      },
      ignorePatterns: [ "dist/**", ],
      rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
      },
    }
