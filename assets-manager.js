let path = require('path');
let sass = require('gulp-sass')(require('sass'));
let cleanCSS = require('gulp-clean-css');
let concat = require('gulp-concat');
let sourcemaps = require('gulp-sourcemaps');
let terser = require('gulp-terser');
let gutil = require('gulp-util');
let bust = require('gulp-buster');
const filter = require('gulp-filter');


module.exports = {
    loadHandlerFromConfig(config) {
        let assetHandler;
        let loadedTasks = [];

        return assetHandler = {
            loadTasks(gulp, options) {
                if (config.stylesheets) {
                    loadedTasks = loadedTasks.concat(loadStyleSheetsFromConfig(gulp, config, options));
                }

                if (config.scripts) {
                    loadedTasks = loadedTasks.concat(loadScriptsFromConfig(gulp, config, options));
                }
            },
            getLoadedTasks() {
                return loadedTasks;
            }
        };
    }
};

function loadStyleSheetsFromConfig(gulp, config, options) {
    return Object.keys(config.stylesheets).map((name) => {
            let data = config.stylesheets[name];
            let srcPrefix = getConfig(config, 'src.prefix');
            let destPrefix = getConfig(config, 'dest.prefix');
            let sassConfig = getConfig(config, 'sass', {});
            let buildDir = path.join(destPrefix, 'css/');

            let src = data.src.map(
                (src) => path.join(srcPrefix, src)
            );

            let watchConfig = options.watchConfig !== undefined ? options.watchConfig : {};

            gulp.task(name, done => {
                const minFilter = filter(['**', '*', '!**/*.min.css', '!*.min.css'], {restore: true});
                gulp.src(src, {allowEmpty: true})
                    .pipe(isProd() ? gutil.noop() : sourcemaps.init())
                    .pipe(minFilter)
                    .pipe(sass(sassConfig).on('error', sass.logError))
                    .pipe(isProd() ? cleanCSS() : gutil.noop())
                    .pipe(minFilter.restore)
                    .pipe(concat(data.dest))
                    .pipe(isProd() ? gutil.noop() : sourcemaps.write())
                    .pipe(gulp.dest(buildDir))
                    .pipe(bust(options.busterConfig))
                    .pipe(gulp.dest(options.busterDir))
                    .on('end', done);
            });

            gulp.task('watch:' + name, () => {
                gulp.watch(src, watchConfig, gulp.series(name));
            });

            return name;
        }
    )
}

function loadScriptsFromConfig(gulp, config, options) {
    return Object.keys(config.scripts).map((name) => {
        let script = config.scripts[name];
        let srcPrefix = getConfig(config, 'src.prefix');
        let destPrefix = getConfig(config, 'dest.prefix');
        let buildDir = path.join(destPrefix, 'js/');

        let src = script.src.map(
            (src) => path.join(srcPrefix, src)
        );

        let watchConfig = options.watchConfig !== undefined ? options.watchConfig : {};

        gulp.task(name, done => {
            const minFilter = filter(['**', '*', '!**/*.min.js', '!*.min.js'], {restore: true});
            gulp.src(src, {allowEmpty: true})
                .pipe(minFilter)
                .pipe(isProd() ? gutil.noop() : sourcemaps.init())
                .pipe(isProd() ? terser() : gutil.noop())
                .pipe(minFilter.restore)
                .pipe(concat(script.dest))
                .pipe(isProd() ? gutil.noop() : sourcemaps.write())
                .pipe(gulp.dest(buildDir))
                .pipe(bust(options.busterConfig))
                .pipe(gulp.dest(options.busterDir))
                .on('end', done);
        });

        gulp.task('watch:' + name, () => {
            gulp.watch(src, watchConfig, gulp.series(name));
        });

        return name;
    });
}

function getConfig(config, keys, defaultVal = '') {
    let obj = config.config;
    let key;

    keys = keys.split('.');
    while ((key = keys.shift()) && obj) {
        obj = obj[key];
    }
    return obj ? obj : defaultVal;
}

function isProd() {
    return gutil.env.env === 'prod';
}
