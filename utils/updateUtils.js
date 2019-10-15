const run = require('./commandRunner');

/**
 * Add submodule, to ignore some errors
 * That do not matter ot us we use "-f" parametter
 * @param {repository} INJECT_REPO Repo link to add as submocule
 * @param {path} SUBMODULE_PATH Path where submodule should be located
 * @param {name} SUBMODULE_NAME Name of submodule
 */
const addSubmodule = (INJECT_REPO, INJECT_BRANCH,  SUBMODULE_PATH, SUBMODULE_NAME) => {
    // first add submodule to project
    const command = `git submodule add -f --name ${SUBMODULE_NAME} --branch ${INJECT_BRANCH} ${INJECT_REPO} ${SUBMODULE_PATH}`;

    run(command);
};

const initUpdateSubmodules = () => {
    // init submodule update
    const command = `git submodule update --init --recursive`;

    run(command);
};

const updateSubmodules = () => {
    // submodule update
    const command = `git submodule update --recursive --remote`;
    run(command);
};

module.exports = {
    addSubmodule,
    initUpdateSubmodules,
    updateSubmodules
};
