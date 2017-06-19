let assert = require('assert');
let path = require('path');
const fs = require('fs-extra');
const {spawn} = require('child_process');

let tmpTestBasicPath = path.join(__dirname, '../.tmp/test-basic');
let tmpAssetsPath = path.join(tmpTestBasicPath, 'assets', 'testbundle');
let tmpAssetsExpPath = path.join(tmpTestBasicPath, 'assets-expected', 'testbundle');

describe('Compile Stylesheets and Scripts', () => {
    it('should run gulp tasks', (done) => {
        fs.copySync('./test/fixtures/test-basic/', './.tmp/test-basic');
        console.log('  Copy fixtures folder to .tmp');

        let gulpCmd = spawn('gulp', ['--env=prod'], {cwd: tmpTestBasicPath, stdio: 'inherit'});

        gulpCmd.on('close', () => {
            let jsPath = path.join(tmpAssetsPath, 'js');
            let cssPath = path.join(tmpAssetsPath, 'css');
            let busterPath = path.join(tmpAssetsPath, 'busters.json');

            //check if folder is not empty
            assert.ok(isExists(cssPath));
            assert.ok(isExists(jsPath));
            assert.ok(isExists(busterPath));

            //count the expected amount of files
            assert.equal(countFiles(cssPath), 3);
            assert.equal(countFiles(jsPath), 1);

            // read and compare created files with the expected files
            assertExpectedOutput('js/test-scripts-1.js');
            assertExpectedOutput('css/test-style-1.css');
            assertExpectedOutput('css/test-style-2.css');
            assertExpectedOutput('css/test-style-3.css');
            assertExpectedOutput('busters.json');

            done();
        });
    });
});


function isExists(path) {
    if (fs.existsSync(path)) {
        return true;
    }
}

function countFiles(path) {
    let dirFiles = fs.readdirSync(path);
    return dirFiles.length;
}

function assertExpectedOutput(file) {

    let createdFile = fs.readFileSync(path.join(tmpAssetsPath, file));
    let expectedFile = fs.readFileSync(path.join(tmpAssetsExpPath, file));

    assert.equal(createdFile.toString(), expectedFile.toString(), file);
}