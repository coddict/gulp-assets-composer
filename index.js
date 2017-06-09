let path = require('path');
let flatten = require('lodash.flatten');
let gutil = require('gulp-util');

const configsLocator = require('./configs-locator');
const assetsManager = require('./assets-manager');

module.exports = {
    init(gulp, options) {

        console.log("Currently running in " + gutil.env.env + " environment");

        let assetHandlers = loadAssetHandlers(options.rootDir);

        assetHandlers.forEach((assetHandler) => {
            assetHandler.loadTasks(gulp, options);
        });

        registerAssetsTasksInGulp(gulp, assetHandlers);
    }
};

function loadAssetHandlers(rootDir) {
    let configsPath = configsLocator.locate(rootDir);

    return configsPath.map((configPath) => {
        let config = require(configPath);

        return assetsManager.loadHandlerFromConfig(config);
    });
}

function registerAssetsTasksInGulp(gulp, assetHandlers) {
    let allTasks = flatten(assetHandlers.map(
        (assetHandler) => assetHandler.getLoadedTasks()
    ));

    gulp.task('default', allTasks);

    gulp.task('watch', allTasks.map(
        (task) => 'watch:' + task
    ));
}
