var path = require('path');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var bust = require('gulp-buster');

module.exports = {
    loadHandlerFromConfig(config) {
        var assetHandler;
        var loadedTasks = [];

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
            var data = config.stylesheets[name];
            var srcPrefix = getConfig(config, 'src.prefix');
            var destPrefix = getConfig(config, 'dest.prefix');
            var sassConfig = getConfig(config, 'sass', {});
            var buildDir = path.join(destPrefix, 'css/');

            var src = data.src.map(
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
        var script = config.scripts[name];
        var srcPrefix = getConfig(config, 'src.prefix');
        var destPrefix = getConfig(config, 'dest.prefix');
        var buildDir = path.join(destPrefix, 'js/');

        var src = script.src.map(
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
    var obj = config.config;
    var key;

    keys = keys.split('.');
    while ((key = keys.shift()) && obj) {
        obj = obj[key];
    }
    return obj ? obj : defaultVal;
}

function isProd() {
    return gutil.env.env === 'prod';
}
