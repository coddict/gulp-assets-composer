var path = require('path');
var flatten = require('lodash.flatten');

const configsLocator = require('./configs-locator');
const assetsManager = require('./assets-manager');

module.exports = {
    init(gulp, options) {
        var assetHandlers = loadAssetHandlers(options.rootDir);

        assetHandlers.forEach((assetHandler) => {
            assetHandler.loadTasks(gulp, options);
        });

        registerAssetsTasksInGulp(gulp, assetHandlers);
    }
};

function loadAssetHandlers(rootDir) {
    let configsPath = configsLocator.locate(rootDir);

    return configsPath.map((configPath) => {
        var config = require(configPath);

        return assetsManager.loadHandlerFromConfig(config);
    });
}

function registerAssetsTasksInGulp(gulp, assetHandlers) {
    var allTasks = flatten(assetHandlers.map(
        (assetHandler) => assetHandler.getLoadedTasks()
    ));

    gulp.task('default', allTasks);

    gulp.task('watch', allTasks.map(
        (task) => 'watch:' + task
    ));
}
