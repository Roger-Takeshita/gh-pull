const chalk = require('chalk');
const path = require('path');
const { rgb, bgRgb } = require('./colors');

const printFolderStatus = (currentPath, basePath) => {
    const folderName = path.relative(basePath, currentPath);

    if (folderName) {
        console.log(
            chalk`{${rgb.white}.${bgRgb.redD}.bold  ${folderName} }{${rgb.red} }`,
        );
    } else {
        console.log(
            chalk`{${rgb.white}.${bgRgb.redD}.bold  ${path.basename(
                path.resolve(process.cwd()),
            )} }{${rgb.red} }`,
        );
    }
};

module.exports = {
    printFolderStatus,
};
