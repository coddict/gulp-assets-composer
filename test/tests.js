let assert = require('assert');
let path = require('path');
const fs = require('fs');
let fixtures = require('./fixtures');

let tempDir = '.tmp';
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

Object.keys(fixtures).map((keyName) => {

    let name = fixtures[keyName].name;
    let data = fixtures[keyName].data;
    let filePath = path.join(tempDir, name);

    fs.writeFileSync(filePath, data);
    console.log("\x1b[32m \u2713 " + name + " successfully created");

});


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
