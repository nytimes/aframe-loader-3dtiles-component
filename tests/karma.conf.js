// Karma configuration.
module.exports = function (config) {
  config.set({
    basePath: '../',
    browsers: ['Firefox', 'Chrome'],
    client: {
      captureConsole: true,
      mocha: { ui: 'tdd' }
    },
    envPreprocessor: ['TEST_ENV'],
    files: [
      // Define test files.
      { pattern: 'tests/**/*.test.js' },
      // Serve test assets.
      { pattern: 'tests/assets/**/*', included: false, served: true }
    ],
    frameworks: ['mocha', 'sinon-chai', 'chai-shallow-deep-equal', 'webpack'],
    preprocessors: { 'tests/**/*.js': ['webpack', 'env'] },
    reporters: ['mocha'],
    webpack: {
      module: {
        rules: [
          {
            test: /\.js/,
            exclude: /(node_modules)/,
            use: ['babel-loader']
          }
        ]
      },
      externals: {
        three: 'THREE'
      }
    }
  });
};
