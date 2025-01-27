import chalk from "chalk";
import pkg from "../package.json";
import updateNotifier from "update-notifier";

export default () => {
  const notifier: updateNotifier = updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 60 * 60 * 24, // 1 day
  });

  if (notifier?.update) {
    const { latest } = notifier?.update;
    console.log(
      chalk.yellow(
        `A new version of ${chalk.underline(
          "4snap"
        )} is available, you are running an older version (${
          pkg.version
        })\nRun ${chalk.green(
          `yarn global add 4snap`
        )} to install version ${latest}.`
      )
    );
  }
};
