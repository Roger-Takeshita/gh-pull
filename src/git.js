const chalk = require('chalk');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { rgb, rgbBG } = require('./colors');
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
                .replace(/\| ([ \d]+) (\++)/gm, '| $1 \x1b[38;5;2m$2\x1b[0m')
                .replace(/\| (.*[^-])(-+\n)/gm, '| $1\x1b[38;5;1m$2\x1b[0m')
                .replace('(+)', '(\x1b[38;5;2m+\x1b[0m)')
                .replace('(-)', '(\x1b[38;5;1m-\x1b[0m)');
            return newStdout;
        } catch (error) {
            if (!middleFolder) {
                printFolderStatus(currentPath, basePath, rgbBG.RDD, rgb.RD);
                console.log();
                console.log(
                    chalk`{${rgb.RDD}.bold ERROR:} {${
                        rgb.RD
                    } ${error.message.replace(/\t/gm, '\x1b[38;5;215m\t')}}`,
                );
            }
        }
    }

    return undefined;
};

module.exports = {
    gitPull,
};
