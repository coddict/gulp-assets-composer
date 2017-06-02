var flatten = require('lodash.flatten');
var fs = require("fs");
var path = require('path');
var glob = require("glob");

module.exports = {
    locate(rootDir) {
        var configsPath = getConfigFromProject(rootDir).concat(getConfigFromVendors(rootDir));

        return flatten(configsPath.map(path => glob.sync(path)));
    }
};

function getConfigFromProject(rootDir) {
    var pkg = require(rootDir + '/composer.json');

    return getPackageConfigs(rootDir, pkg);
}

function getConfigFromVendors(rootDir) {
    var composerLock = fs.readFileSync(rootDir + "/composer.lock");
    var pkgs = JSON.parse(composerLock).packages;

    return flatten(pkgs.map(
        (pkg) => getPackageConfigs(rootDir, pkg, true)
    ));
}

function getPackageConfigs(rootDir, pkg, isVendor) {
    if (pkg.extra) {
        if (pkg.extra['gulp-asset-manager']) {
            function absPath(configPath) {
                if (isVendor) {
                    return path.join(rootDir, 'vendor', pkg.name, configPath);
                } else {
                    return path.join(rootDir, configPath);
                }
            }

            return pkg.extra['gulp-asset-manager'].configs.map(absPath);
        }
    }
    return [];
}