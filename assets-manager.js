let path = require('path');
let sass = require('gulp-sass');
let cleanCSS = require('gulp-clean-css');
let concat = require('gulp-concat');
let sourcemaps = require('gulp-sourcemaps');
let uglify = require('gulp-uglify');
let gutil = require('gulp-util');
let bust = require('gulp-buster');

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

            gulp.task(name, () => {
                gulp.src(src)
                    .pipe(sourcemaps.init())
                    .pipe(sass(sassConfig).on('error', sass.logError))
                    .pipe(concat(data.dest))
                    .pipe(isProd() ? cleanCSS() : gutil.noop())
                    .pipe(sourcemaps.write())
                    .pipe(gulp.dest(buildDir))
                    .pipe(bust(options.busterConfig))
                    .pipe(gulp.dest(options.busterDir));

            });

            gulp.task('watch:' + name, () => {
                gulp.watch(src, [name]);
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


        gulp.task(name, () => {
            return gulp.src(src)
                .pipe(sourcemaps.init())
                .pipe(concat(script.dest))
                .pipe(isProd() ? uglify() : gutil.noop())
                .pipe(sourcemaps.write())
                .pipe(gulp.dest(buildDir))
                .pipe(bust(options.busterConfig))
                .pipe(gulp.dest(options.busterDir));
        });

        gulp.task('watch:' + name, () => {
            gulp.watch(src, [name]);
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
