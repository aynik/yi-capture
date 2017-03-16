module.exports = (config) => {
  config.set({
    basePath: '',
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'chai', 'effroi'],
    reporters: ['verbose'],
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    autoWatchBatchDelay: 300,
    files: [
      { pattern: 'node_modules/babel-polyfill/browser.js', instrument: false },
      { pattern: './tests/*.spec.js', watched: false },
      { pattern: './tests/fixtures/*', included: false }
    ],
    preprocessors: {
      './tests/*.spec.js': ['webpack']
    },
    webpack: require('./webpack.config.js'),
    webpackMiddleware: {
      noInfo: true
    }
  })
}
