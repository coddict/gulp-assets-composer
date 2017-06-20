let gulp = require('gulp');
let gulpAssetManager = require('../../index.js');

gulpAssetManager.init(gulp, {
    rootDir: __dirname,
    busterDir: 'assets/testbundle',
    busterConfig: {
        relativePath: 'assets',
        length: 10,
    }
});