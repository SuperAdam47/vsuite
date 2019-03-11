module.exports = {
  presets: [['@babel/preset-env', { modules: false }]],
  plugins: [
    '@babel/plugin-syntax-jsx',
    'transform-vue-jsx',
    'transform-object-rest-spread',
  ],
  env: {
    test: {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
    },
  },
};
