import chalk from "chalk";

const logger = {
  error(...args: unknown[]) {
    console.log("\n" + chalk.red(...args) + "\n");
  },
  warn(...args: unknown[]) {
    console.log("\n" + chalk.yellow(...args) + "\n");
  },
  info(...args: unknown[]) {
    console.log("\n" + chalk.cyan(...args) + "\n");
  },
  success(...args: unknown[]) {
    console.log("\n" + chalk.green(...args) + "\n");
  },
};

export default logger;
