#!/usr/bin/env node

/**
 * Library Imports
 */
const fs = require('fs');
const dotenv = require('dotenv');
const shell = require('shelljs');

/**
 * Import Utils
 */
const {
    addSubmodule,
    updateSubmodules,
    initUpdateSubmodules
} = require('./utils/updateUtils');
const askUser = require('./utils/askUser');
const {
    removeSubmodule
} = require('./utils/removeUtils');


/**
 * Init Libraries
 */
dotenv.config();

/**
 * CONSTANTS
 */
const {
    INJECT_REPO,
    INJECT_REPO_BRANCH,
    INJECT_REPO_BRANCH_OVERWRITE,
} = process.env;
const SUBMODULE_PATH = './src/core/';

/**
 * Helpers
 */
const printBranchInfo = () => {
    console.log(`INJECT_REPO=${INJECT_REPO || '...'}`);
    console.log(`INJECT_REPO_BRANCH=${INJECT_REPO_BRANCH || '...'}`);
};

const getExistingCoreRepo = () => {
    const output = shell.exec(`git --git-dir ${SUBMODULE_PATH}.git config --get remote.origin.url`, { silent: true });
    return output.trim();
};

const getExistingCoreBranch = () => {
    const output = shell.exec(`git --git-dir ${SUBMODULE_PATH}.git rev-parse --abbrev-ref HEAD`, { silent: true });
    return output.trim();
}

const checkRepoMatch = () => {
    // check if current repo is same as .env branch
    const existingRepo = getExistingCoreRepo();
    const existingBranch = getExistingCoreBranch();
    console.log('existingBranch:', existingBranch);

    if (INJECT_REPO !== existingRepo || INJECT_REPO_BRANCH !== existingBranch) {
        console.error('Error: Repo or branch mismatch!');
        console.info('Existing repo or branch in ./src/core is not the same as INJECT_REPO in .env config!');
        console.info('------------------------------------------------------------------------------------');
        console.info(`Existing repo in ./src/core: \t\t${existingRepo}`);
        console.info(`Repo in .env config INJECT_REPO: \t${INJECT_REPO}`);
        console.info(`Existing branch in ./src/core: \t\t${existingBranch}`);
        console.info(`Branch in .env config INJECT_REPO: \t${INJECT_REPO_BRANCH}`);
        console.info('------------------------------------------------------------------------------------');
        return false;
    }

    return true;
};

async function init() {
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
    const CORE_FOLDER_EXISTS = !!fs.existsSync(SUBMODULE_PATH);


    // #### GITTING ######################################
    /**
     * If core repo does not exist
     *  - clone repo to ./src/core
     *  - checkout branch
     */
    if (!CORE_FOLDER_EXISTS) {
        console.info('Cloning core repo!');
        printBranchInfo();

        // add submodule
        addSubmodule(
            INJECT_REPO, INJECT_REPO_BRANCH, SUBMODULE_PATH, SUBMODULE_PATH
        );

        // init submodule update
        initUpdateSubmodules();

        // update submodules
        updateSubmodules();
    }

    /**
     * Check Branches
     *  - Check if existing branch is the same as .env branch
     */
    if (CORE_FOLDER_EXISTS && !checkRepoMatch()) {
        try{
            const answer = INJECT_REPO_BRANCH_OVERWRITE || await askUser('Do you want to overwrite repo ? (y/n): ');
            if(answer === 'y') {
                removeSubmodule(SUBMODULE_PATH);

                addSubmodule(
                    INJECT_REPO, INJECT_REPO_BRANCH, SUBMODULE_PATH, SUBMODULE_PATH
                );
            }
        } catch(e) {
            console.error(e);
            shell.exit(1);
        }
    }

    /**
     * If core exists
     *  - pull from repo:branch
     */
    if (CORE_FOLDER_EXISTS) {
        console.info('Updating core repo!');
        printBranchInfo();

        updateSubmodules();
    }
}

init();
