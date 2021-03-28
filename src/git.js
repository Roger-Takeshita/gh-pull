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
            const { stdout: modifications } = await exec('git pull');
            const { stdout: branchLog } = await exec(
                'git branch --show-current',
            );
            const branch = branchLog.replace(/\n/g, '').trim();

            if (modifications.includes('Already up to date.')) {
                return { log: modifications.replace(/\n*$/, ''), branch };
            }
            const formatModifications = modifications
                .replace(/\| ([ \d]+) (\++)/gm, '| $1 \x1b[38;5;2m$2\x1b[0m')
                .replace(/\| (.*[^-])(-+\n)/gm, '| $1\x1b[38;5;1m$2\x1b[0m')
                .replace('(+)', '(\x1b[38;5;2m+\x1b[0m)')
                .replace('(-)', '(\x1b[38;5;1m-\x1b[0m)')
                .replace(/\n*$/, '');
            return { log: formatModifications, branch };
        } catch (error) {
            printFolderStatus(currentPath, basePath, rgbBG.RDD, rgb.RDD, '');
            console.log();
            console.log(
                chalk`{${rgb.RDD}.bold ERROR:} {${
                    rgb.RD
                } ${error.message
                    .replace(/\t/gm, '\x1b[38;5;215m\t')
                    .replace(/\n*$/, '')}}`,
            );
            console.log();
        }
    }

    return undefined;
};

module.exports = {
    gitPull,
};
