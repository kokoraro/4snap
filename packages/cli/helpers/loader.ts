import ora from "ora";

async function showLoading() {
  let spinner: any;
  return {
    start: (message: string) => {
      spinner = ora(message + "\n").start();
    },
    stop: () => {
      spinner.stop();
    },
    success: (successMessage: string) => {
      if (spinner) {
        spinner.stop();
        spinner.succeed(successMessage);
      }
    },
    fail: (errorMessage: string | null) => {
      if (spinner) {
        spinner.stop();
        spinner.fail(errorMessage + "\n");
      }
    },
  };
}

export default showLoading;
