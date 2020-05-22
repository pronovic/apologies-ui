 module.exports = {
      root: true,
      env: {
        node: true
      },
      'extends': [
        'standard',
        'plugin:vue/essential',
        'plugin:prettier/recommended',
        '@vue/prettier'
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
