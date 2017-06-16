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
            done();
        });
        // 3. Make sure .tmp/test-basic/assets is as we expect it to be (content of files & file list)
    });
});

