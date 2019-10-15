var readlineSync = require('readline-sync');

async function askUser(question) {
    return new Promise((resolve, reject) => {
        const sentinel = true;
        let result = '';

        while (result.trim() !== 'n' && result.trim() !== 'y') {
            result = readlineSync.question(question);
        }

        resolve(result.trim());
    })
}

module.exports=askUser;
