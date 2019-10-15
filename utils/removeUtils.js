// import modules
const run = require('./commandRunner');

const removeSubmodule = (submodulePath) => {
    const command = `git rm -rf ${submodulePath} -f`;
    run(command, '', false);
}

module.exports={
    removeSubmodule
}
