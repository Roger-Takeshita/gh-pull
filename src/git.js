const chalk = require('chalk');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { rgb } = require('./colors');
const { printFolderStatus } = require('./print');

const gitPull = async (currentPath, basePath, middleFolder = false) => {
    if (fs.existsSync(`${currentPath}/.git`) || middleFolder) {
        try {
            process.chdir(currentPath);
            const { stdout } = await exec('git pull');

            if (stdout.includes('Already up to date.')) {
                return stdout;
            }
            const newStdout = stdout
                .replace(/\| (\d+) (\++)/gm, '| $1 \x1b[32m$2\x1b[0m')
                .replace(/\| (.*[^-])(\-+)/gm, '| $1\x1b[31m$2\x1b[0m')
                .replace('(+)', '(\x1b[32m+\x1b[0m)')
                .replace('(-)', '(\x1b[31m-\x1b[0m)');
            return newStdout;
        } catch (error) {
            if (!middleFolder) {
                printFolderStatus(currentPath, basePath);
                console.log();
                console.log(
                    chalk`{${rgb.redD}.bold ERROR:} {${rgb.orange} ${error.message}}`,
                );
            }
        }
    }

    return undefined;
};

module.exports = {
    gitPull,
};
