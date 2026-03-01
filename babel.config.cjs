module.exports = function babelConfig(api) {
  const isTest = api.env('test');
  api.cache(() => isTest);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: isTest ? { node: 'current' } : { browsers: 'defaults' },
          modules: 'auto'
        }
      ],
      ['@babel/preset-react', { runtime: 'automatic' }]
    ]
  };
};
