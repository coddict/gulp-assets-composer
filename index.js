let path = require('path');
let flatten = require('lodash.flatten');
let gutil = require('gulp-util');

const configsLocator = require('./configs-locator');
const assetsManager = require('./assets-manager');

module.exports = {
    init(gulp, options) {

        let assetHandlers = loadAssetHandlers(options.rootDir);
        assetHandlers.forEach((assetHandler) => {
            assetHandler.loadTasks(gulp, options);
        });

        registerAssetsTasksInGulp(gulp, assetHandlers);

        let environment = gutil.env.env;
        if(!environment){
            environment = 'dev';
        }
        console.log("\x1b[34m Currently running in a","\x1b[37m" + environment + "\x1b[34m environment");
    }
};

function loadAssetHandlers(rootDir) {
    let configsPath = configsLocator.locate(rootDir);

    console.log("\x1b[34m","Loading Configuration files...");
    configsPath.map(function(configPath) {
        console.log("\x1b[32m",configPath);
    });

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
