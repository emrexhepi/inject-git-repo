#!/usr/bin/env node

/**
 * Library Imports
 */
const fs = require('fs');
const shell = require('shelljs');
const dotenv = require('dotenv');

/**
 * Init Libraries
 */
dotenv.config();

/**
 * Desconstruct node .env
 */
const {
    INJECT_REPO,
    INJECT_REPO_BRANCH,
} = process.env;

/**
 * Helpers
 */
const printBranchInfo = () => {
    console.log(`INJECT_REPO=${INJECT_REPO || '...'}`);
    console.log(`INJECT_REPO_BRANCH=${INJECT_REPO_BRANCH || '...'}`);
};

const getExistingCoreBranchUrl = () => {
    const output = shell.exec('git --git-dir ./src/core/.git config --get remote.origin.url', { silent: true });
    return output.trim();
};

const cloneCoreRepo = () => {
    const cloneCommand = `git clone ${INJECT_REPO} ./src/core/ --branch ${INJECT_REPO_BRANCH}`;
    const cloneOutput = shell.exec(
        cloneCommand
    );
    if (cloneOutput.code !== 0) {
        shell.echo('Error: Git commit failed');
        shell.exit(1);
    }
};

const checkRepoMatch = () => {
    // check if current repo is same as .env branch
    const existingBranch = getExistingCoreBranchUrl();
    if (INJECT_REPO !== existingBranch) {
        console.error('Error: Repo mismatch!');
        console.info('Existing repo in ./src/core is not the same as INJECT_REPO in .env config!');
        console.info(`Existing repo in ./src/core: \t${existingBranch}`);
        console.info(`Repo in .env config INJECT_REPO: \t${INJECT_REPO}`);
        return false;
    }

    return true;
};

const pullFromCoreRepo = () => {
    // pull from repo
    const pullCommand = `git --git-dir ./src/core/.git pull origin ${INJECT_REPO_BRANCH}`;
    const pullOutput = shell.exec(pullCommand);
    if (pullOutput.code !== 0) {
        shell.echo('Error: Git pull failed');
        shell.exit(1);
    }
};

// #### CHECKS ######################################
/**
 * Check if env variables exists
 */
if (!INJECT_REPO || !INJECT_REPO_BRANCH) {
    console.error('Error: Please config the above .env variables correclty');
    printBranchInfo();
    shell.exit(1);
}

/**
 * Check if tools exist
 */
if (!shell.which('git')) {
    console.error('Sorry, this script requires git');
    shell.exit(1);
}

/**
 * Core folder Check
 *  - check if core folder exists inside the ./src
 */
const CORE_FOLDER_EXISTS = !!fs.existsSync('./src/core');


// #### GITTING ######################################
/**
 * If core repo does not exist
 *  - clone repo to ./src/core
 *  - checkout branch
 */
if (!CORE_FOLDER_EXISTS) {
    console.info('Cloning core repo!');
    printBranchInfo();

    // clone repo
    cloneCoreRepo();
}

/**
 * Check Branches
 *  - Check if existing branch is the same as .env branch
 */
if (CORE_FOLDER_EXISTS && !checkRepoMatch()) {
    shell.exit(1);
}

/**
 * If core exists
 *  - pull from repo:branch
 */
if (CORE_FOLDER_EXISTS) {
    console.info('Updating core repo!');
    printBranchInfo();

    pullFromCoreRepo();
}
