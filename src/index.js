#!/usr/bin/env node

const fs = require('fs');
const { gitPull } = require('./git');
const { printFolderStatus } = require('./print');
const { rgb, rgbBG } = require('./colors');

let counter = 0;

const checkCurrentFolder = async (currentPath, basePath, folderCount) => {
    try {
        const pullStatus = await gitPull(currentPath, basePath);

        if (pullStatus) {
            if (folderCount > 0) {
                if (pullStatus.includes('Already up to date.')) {
                    printFolderStatus(currentPath, basePath, rgbBG.GND, rgb.GN);
                } else {
                    printFolderStatus(currentPath, basePath, rgbBG.BLD, rgb.BL);
                }
            }

            console.log();
            console.log(pullStatus);
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
        console.log(error);
    }
};

const init = async () => {
    console.time('Done in');

    try {
        await checkCurrentFolder(process.cwd(), process.cwd(), 0);

        if (counter === 0) {
            await gitPull(process.cwd(), true);
            console.log();
        }
    } catch (error) {
        console.log(error);
    }

    console.timeEnd('Done in');
    console.log();
};

init();
