let assert = require('assert');
let path = require('path');
let fs = require('fs');
let fixtures = require('./fixtures');


Object.keys(fixtures.fakeFiles).map((keyName) => {
    fixtures.fakeFiles[keyName].map((file) => {
        let filePath = path.join(fixtures.bundlePath, file.name);
        fs.writeFileSync(filePath, file.data);
        console.log("\x1b[32m \u2713 " + file.name + " successfully created");
    });
});

//
// let fakeConfig = {
//     "config": {
//         "src": {
//             "prefix": tempDir
//         },
//         "dest": {
//             "prefix": tempAssets
//         },
//         "sass": {
//             "includePaths": [
//                 "src/"
//             ]
//         }
//     },
//     "stylesheets": {
//         "almada-atf-layout": {
//             "src": [
//                 "almadawebsite/css/reset.css",
//                 "almadawebsite/royalslider/royalslider.css",
//                 "almadawebsite/royalslider/skins/default/rs-default.css"
//             ],
//             "dest": "atf-layout.css"
//         }
//
//     },
//     "scripts": {
//         "almada-scripts-js": {
//             "src": [
//                 "almadawebsite/js/main.js",
//                 "almadawebsite/js/weather.js"
//             ],
//             "dest": "scripts.js"
//         }
//     }
// };

// describe('compile scripts', () => {
//     it('should concatenate all js in each task', () => {
//         assert.ok(true);
//     });
// });
//
// describe('compile stylesheets', () => {
//     it('should concatenate all css/scss in each task', () => {
//         assert.ok(true);
//     });
// });
//
//
