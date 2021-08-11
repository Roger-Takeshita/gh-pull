#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');
const { gitPull } = require('./git');
const { printFolderStatus } = require('./print');
const { rgb, rgbBG } = require('./colors');

let counter = 0;

const checkCurrentFolder = async (currentPath, basePath, folderCount) => {
    try {
        const folder = await gitPull(currentPath, basePath);

        if (folder) {
            if (folderCount > 0) {
                if (folder.log.includes('Already up to date.')) {
                    printFolderStatus(
                        currentPath,
                        basePath,
                        rgbBG.GND2,
                        rgb.GND2,
                        folder.branch,
                        rgbBG.GN,
                        rgb.GN,
                    );
                } else {
                    printFolderStatus(
                        currentPath,
                        basePath,
                        rgbBG.BLD,
                        rgb.BLD,
                        folder.branch,
                        rgbBG.BL,
                        rgb.BL,
                    );
                }
            }

            console.log();
            console.log(folder.log);
            console.log();
            counter += 1;
        } else {
            const files = fs
                .readdirSync(currentPath)
                .sort((a, b) => a.localeCompare(b));

            for (let i = 0; i < files.length; i += 1) {
                const nextFile = `${currentPath}/${files[i]}`;
                if (
                    files[i] !== '.rvm' &&
                    files[i] !== '.vscode' &&
                    files[i] !== '.git' &&
                    files[i] !== 'node_modules' &&
                    files[i] !== 'node_modules.nosync' &&
                    fs.lstatSync(nextFile).isDirectory()
                ) {
                    const updateCount = folderCount + 1;
                    // eslint-disable-next-line no-await-in-loop
                    await checkCurrentFolder(nextFile, basePath, updateCount);
                }
            }
        }
    } catch (error) {
        printFolderStatus(currentPath, basePath, rgbBG.RDD, rgb.RDD);
        console.log();
        console.log(error);
    }
};

const init = async () => {
    console.time('Done in');

    try {
        const currentFolder = process.cwd();
        await checkCurrentFolder(currentFolder, currentFolder, 0);
        if (counter === 0) {
            const folder = await gitPull(currentFolder, currentFolder, true);
            if (folder.log) {
                console.log();
                console.log(folder.log);
                console.log();
            }
        }
    } catch (error) {
        console.log();
        console.log(
            chalk`{${rgb.RDD}.bold ERROR:} {${rgb.RD} ${error
                .replace(/\t/gm, '\x1b[38;5;215m\t')
                .replace(/\n*$/, '')}}`,
        );
    }

    console.timeEnd('Done in');
    console.log();
};

init();
