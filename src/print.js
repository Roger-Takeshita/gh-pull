const chalk = require('chalk');
const path = require('path');
const { rgb } = require('./colors');

const printFolderStatus = (
    currentPath,
    basePath,
    bgColor,
    fgColor,
    branch,
    branchBgColor,
    branchFgColor,
) => {
    const folderName = path.relative(basePath, currentPath);

    if (folderName && branch) {
        console.log(
            chalk`{${rgb.WHT}.${bgColor}.bold  ${folderName} }{${branchBgColor}.${fgColor} }{${branchBgColor}.${rgb.BK}   ${branch} }{${branchFgColor} }`,
        );
    } else if (folderName && !branch) {
        console.log(
            chalk`{${rgb.WHT}.${bgColor}.bold  ${folderName} }{${fgColor} }`,
        );
    }
};

module.exports = {
    printFolderStatus,
};
