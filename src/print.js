const chalk = require('chalk');
const path = require('path');
const { rgb } = require('./colors');

const printFolderStatus = (currentPath, basePath, bgColor, fgColor) => {
    const folderName = path.relative(basePath, currentPath);

    if (folderName) {
        console.log(
            chalk`{${rgb.WHT}.${bgColor}.bold  ${folderName} }{${fgColor} }`,
        );
    } else {
        console.log(
            chalk`{${rgb.WHT}.${bgColor}.bold  ${path.basename(
                path.resolve(process.cwd()),
            )} }{${fgColor} }`,
        );
    }
};

module.exports = {
    printFolderStatus,
};
