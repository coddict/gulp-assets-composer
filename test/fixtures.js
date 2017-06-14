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
                "prefix": "web/bundles"
            },
            "dest": {
                "prefix": "web/assets/almadavotingpolls"
            },
            "sass": {
                "includePaths": [
                    "src/"
                ]
            }
        },
        "stylesheets": {
            "votingpolls-atf-welcome": {
                "src": [
                    "almadavotingpolls/scss/welcome.scss",
                    "almadavotingpolls/scss/top-candidates.scss"
                ],
                "dest": "atf-welcome.css"
            }
        },
        "scripts": {
            "votingpolls-welcome-js": {
                "src": [
                    "almadavotingpolls/js/top-candidates.js"
                ],
                "dest": "welcome.js"
            }
        }
    }
];

module.exports = {
    'fakeCss': {
        'name': 'test.css',
        'data': fakeCss
    },
    'fakeScss': {
        'name': 'test.scss',
        'data': fakeScss
    },
    'fakeJS': {
        'name': 'test.js',
        'data': fakeJs
    },
    'fakeComposer': {
        'name': 'composer.json',
        'data': JSON.stringify(fakeComposer)
    },
    'fakeComposerLock': {
        'name': 'composer.lock',
        'data': JSON.stringify(fakeComposerLock)
    }
};