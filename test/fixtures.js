let fs = require('fs');

let tempDir = '.tmp';
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

let tempBundle = '.tmp/bundle';
if (!fs.existsSync(tempBundle)) {
    fs.mkdirSync(tempBundle);
}

let tempAssets = '.tmp/assets';
if (!fs.existsSync(tempAssets)) {
    fs.mkdirSync(tempAssets);
}


let fakeCss = 'body {width:100%;height:400px;color:red}';
let fakeScss = 'body {width:100%;height:400px;color:red .element {color:blue;text-decoration:none;}}';
let fakeJs = 'alert("test")';
let fakeComposer = [
    {
        "extra": {
            "gulp-assets-composer": {
                "configs": [
                    "config.json"
                ]
            }
        }
    }
];
let fakeComposerLock = [
    {
        "packages": [
            {
                "extra": {
                    "gulp-assets-composer": {
                        "configs": [
                            "config.json"
                        ]
                    }
                }
            }
        ]
    }
];

let fakeConfig = [
    {
        "config": {
            "src": {
                "prefix": tempDir
            },
            "dest": {
                "prefix": tempAssets
            },
            "sass": {
                "includePaths": [
                    "src/"
                ]
            }
        },
        "stylesheets": {}
    }
];

module.exports = {
    'bundlePath': tempBundle,
    'fakeFiles': {
        'fakeCss': [
            {'name': 'test-1.css', 'data': fakeCss},
            {'name': 'test-2.css', 'data': fakeCss},
            {'name': 'test-3.css', 'data': fakeCss},
            {'name': 'test-4.css', 'data': fakeCss}
        ],
        'fakeScss': [
            {'name': 'test-1.scss', 'data': fakeScss},
            {'name': 'test-2.scss', 'data': fakeScss},
            {'name': 'test-3.scss', 'data': fakeScss}
        ],
        'fakeJs': [
            {'name': 'test-1.js', 'data': fakeJs},
            {'name': 'test-2.js', 'data': fakeJs}
        ],
        'fakeComposer': [
            {'name': 'composer.json', 'data': JSON.stringify(fakeComposer)}
        ],
        'fakeComposerLock': [
            {'name': 'composer.lock', 'data': JSON.stringify(fakeComposerLock)}
        ],
        'fakeConfig': [
            {'name': 'config.json', 'data': JSON.stringify(fakeConfig)}
        ]
    }
};

let stylesheets = [];

module.exports.fakeFiles.fakeCss.map((data) => {
    stylesheets.push(data.name);
});

module.exports.fakeFiles.fakeScss.map((data) => {
    stylesheets.push(data.name);
});

let styleSheetsTasks = [

]

