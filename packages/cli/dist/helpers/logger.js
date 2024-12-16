import chalk from "chalk";
const logger = {
    error(...args) {
        console.log("\n" + chalk.red(...args) + "\n");
    },
    warn(...args) {
        console.log("\n" + chalk.yellow(...args) + "\n");
    },
    info(...args) {
        console.log("\n" + chalk.cyan(...args) + "\n");
    },
    success(...args) {
        console.log("\n" + chalk.green(...args) + "\n");
    },
};
export default logger;
