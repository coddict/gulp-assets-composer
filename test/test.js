let assert = require('assert');
let path = require('path');
const fs = require('fs-extra')
const {spawn} = require('child_process');


describe('Compile Stylesheets', () => {
    it('should concatenate all css/scss in each task', (done) => {
        fs.copySync('./test/fixtures/test-basic/', './.tmp/test-basic');
        console.log('  Copy fixtures folder to .tmp');

        let gulpCmd = spawn('gulp', {cwd: path.join(__dirname, '../.tmp/test-basic/')});

        gulpCmd.on('close', () => {
            // do your assertions;
            let jsPath = path.join(__dirname, '../.tmp/test-basic/assets/testbundle/js');
            let cssPath = path.join(__dirname, '../.tmp/test-basic/assets/testbundle/css');
            let busterPath = path.join(__dirname, '../.tmp/test-basic/assets/testbundle/busters.json');
            assert.ok(isExists(cssPath));
            assert.ok(isExists(jsPath));
            assert.ok(isExists(busterPath));
            assert.equal(countFiles(cssPath), 3);
            assert.equal(countFiles(jsPath), 1);
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
   let dirFiles =  fs.readdirSync(path);
   return dirFiles.length;
}