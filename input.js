const readline = require("readline");

async function getAnswer(readlineInterface, customQuestion) {
    const question = customQuestion !== null ? `${customQuestion}\n> ` : "> ";
    return new Promise((resolve) => {
        readlineInterface.question(question, answer => resolve(answer));
    });
}

async function get(customQuestion = null) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        getAnswer(rl, customQuestion)
            .then(answer => {
                rl.close();
                resolve(answer);
            })
    })
}

module.exports = {
    get
};
