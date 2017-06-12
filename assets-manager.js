let path = require('path');
let sass = require('gulp-sass');
let cleanCSS = require('gulp-clean-css');
let concat = require('gulp-concat');
let sourcemaps = require('gulp-sourcemaps');
let uglify = require('gulp-uglify');
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



            gulp.task(name, () => {
                const minFilter = filter(['**','**/*.min.css'], {restore: true});
                gulp.src(src)
                    .pipe(isProd() ? gutil.noop() : sourcemaps.init())
                    .pipe(minFilter)
                    .pipe(sass(sassConfig).on('error', sass.logError))
                    .pipe(isProd() ? cleanCSS() : gutil.noop())
                    .pipe(minFilter.restore)
                    .pipe(concat(data.dest))
                    .pipe(isProd() ? gutil.noop() : sourcemaps.write())
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
            const minFilter = filter(['**', '**/*.min.js'], {restore: true});
            gulp.src(src)
                .pipe(minFilter)
                .pipe(isProd() ? gutil.noop() : sourcemaps.init())
                .pipe(isProd() ? uglify() : gutil.noop())
                .pipe(minFilter.restore)
                .pipe(concat(script.dest))
                .pipe(isProd() ? gutil.noop() : sourcemaps.write())
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
