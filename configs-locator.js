let flatten = require('lodash.flatten');
let fs = require("fs");
let path = require('path');
let glob = require("glob");

module.exports = {
    locate(rootDir) {
        let configsPath = getConfigFromProject(rootDir).concat(getConfigFromVendors(rootDir));

        return flatten(configsPath.map(path => glob.sync(path)));
    }
};

function getConfigFromProject(rootDir) {
    let pkg = require(rootDir + '/composer.json');

    return getPackageConfigs(rootDir, pkg);
}

function getConfigFromVendors(rootDir) {
    let composerLock = fs.readFileSync(rootDir + "/composer.lock");
    let pkgs = JSON.parse(composerLock).packages;

    return flatten(pkgs.map(
        (pkg) => getPackageConfigs(rootDir, pkg, true)
    ));
}

function getPackageConfigs(rootDir, pkg, isVendor) {
    if (pkg.extra) {
        if (pkg.extra['gulp-assets-composer']) {
            function absPath(configPath) {
                if (isVendor) {
                    return path.join(rootDir, 'vendor', pkg.name, configPath);
                } else {
                    return path.join(rootDir, configPath);
                }
            }

            return pkg.extra['gulp-assets-composer'].configs.map(absPath);
        }
    }
    return [];
}
