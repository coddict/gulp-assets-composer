let assert = require('assert');
let path = require('path');
const fs = require('fs-extra');
const {spawn} = require('child_process');


runTest('prod');
runTest('dev');


function runTest(env) {
    let tmpTestBasicPath = path.join(__dirname, '../.tmp/test-basic-' + env);
    let tmpAssetsPath = path.join(tmpTestBasicPath, 'assets', 'testbundle');
    let tmpAssetsExpPath = path.join(tmpTestBasicPath, 'assets-expected', 'testbundle');

    describe('Compile stylesheets and scripts in a ' + env + ' environment', () => {
        it('should run gulp tasks', (done) => {
            fs.copySync('./test/fixtures/test-basic-' + env, './.tmp/test-basic-' + env);
            console.log('  Copy fixtures folder to .tmp');

            let gulpCmd = spawn('gulp', ['--env=' + env], {cwd: tmpTestBasicPath});

            gulpCmd.on('close', (statusCode) => {
                let jsPath = path.join(tmpAssetsPath, 'js');
                let cssPath = path.join(tmpAssetsPath, 'css');
                let busterPath = path.join(tmpAssetsPath, 'busters.json');

                assert.equal(statusCode, 0);

                //check if folder is not empty
                assert.ok(isExists(cssPath));
                assert.ok(isExists(jsPath));
                assert.ok(isExists(busterPath));

                //count the expected amount of files
                assert.equal(countFiles(cssPath), 3);
                assert.equal(countFiles(jsPath), 1);

                // read and compare created files with the expected files
                assertExpectedOutput(tmpAssetsPath, tmpAssetsExpPath, 'js/test-scripts-1.js');
                assertExpectedOutput(tmpAssetsPath, tmpAssetsExpPath, 'css/test-style-1.css');
                assertExpectedOutput(tmpAssetsPath, tmpAssetsExpPath, 'css/test-style-2.css');
                assertExpectedOutput(tmpAssetsPath, tmpAssetsExpPath, 'css/test-style-3.css');
                assertExpectedOutput(tmpAssetsPath, tmpAssetsExpPath, 'busters.json');

                done();
            });
        });
    });
}


function isExists(path) {
    if (fs.existsSync(path)) {
        return true;
    }
}

function countFiles(path) {
    let dirFiles = fs.readdirSync(path);
    return dirFiles.length;
}

function assertExpectedOutput(createdPath, expPath, file) {

    let createdFile = fs.readFileSync(path.join(createdPath, file));
    let expectedFile = fs.readFileSync(path.join(expPath, file));

    assert.equal(createdFile.toString().trim(), expectedFile.toString().trim(), file);
}
