let path = require('path');
let sass = require('gulp-sass')(require('sass'));
let cleanCSS = require('gulp-clean-css');
let concat = require('gulp-concat');
let sourcemaps = require('gulp-sourcemaps');
let terser = require('gulp-terser');
let gutil = require('gulp-util');
let bust = require('gulp-buster');
const filter = require('gulp-filter');
const fs = require("fs");


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

function getSourceMapsConfig(options) {
    if (!!options.sourceMapsConfig) {
        return options.sourceMapsConfig;
    }

    return isProd() ? null : {destPath: null};
}

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
                ensureFilesExist(name, src, options.strictMode);

                const sourceMapsConfig = getSourceMapsConfig(options);
                const minFilter = filter(['**', '*', '!**/*.min.css', '!*.min.css'], {restore: true});
                gulp.src(src, {allowEmpty: true, base: options.sourcesDir})
                    .pipe(sourceMapsConfig ? sourcemaps.init() : gutil.noop())
                    .pipe(minFilter)
                    .pipe(sass(sassConfig).on('error', sass.logError))
                    .pipe(isProd() ? cleanCSS() : gutil.noop())
                    .pipe(minFilter.restore)
                    .pipe(concat(data.dest))
                    .pipe(sourceMapsConfig ? sourcemaps.write(sourceMapsConfig.destPath, sourceMapsConfig) : gutil.noop())
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

function ensureFilesExist(name, files, triggerErrorOnMissing)
{
    const fs = require('fs');
    const ansi = require('gulp-cli/lib/shared/ansi');

    let nbMissingFiles = 0;
    for (const file of files) {
        if (!fs.existsSync(file)) {
            if (nbMissingFiles === 0) {
                console.group(ansi.cyan(name) + ansi.red(' configures invalid file paths:'));
            }

            ++nbMissingFiles;
            console.error(ansi.yellow(' - ' + file + ' -> skipped'));
        }
    }

    if (nbMissingFiles > 0) {
        console.groupEnd();

        if (triggerErrorOnMissing) {
            throw new Error(ansi.red(`Could not find ${nbMissingFiles} files, aborting`));
        }
    }
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
            ensureFilesExist(name, src, options.strictMode);

            const sourceMapsConfig = getSourceMapsConfig(options);
            const minFilter = filter(['**', '*', '!**/*.min.js', '!*.min.js'], {restore: true});
            gulp.src(src, {allowEmpty: true, base: options.sourcesDir})
                .pipe(sourceMapsConfig ? sourcemaps.init() : gutil.noop())
                .pipe(minFilter)
                .pipe(isProd() ? terser() : gutil.noop())
                .pipe(minFilter.restore)
                .pipe(concat(script.dest))
                .pipe(sourceMapsConfig ? sourcemaps.write(sourceMapsConfig.destPath, sourceMapsConfig) : gutil.noop())
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
