const StyleDictionary = require('style-dictionary');

// Register custom transforms if needed
// StyleDictionary.registerTransform({...});

module.exports = {
  source: ['src/tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
        options: {
          outputReferences: true
        }
      }]
    },
    scss: {
      transformGroup: 'scss',
      buildPath: 'src/styles/',
      files: [{
        destination: 'tokens.scss',
        format: 'scss/variables',
        options: {
          outputReferences: true
        }
      }]
    },
    js: {
      transformGroup: 'js',
      buildPath: 'src/styles/',
      files: [{
        destination: 'tokens.js',
        format: 'javascript/es6'
      }]
    }
  }
};