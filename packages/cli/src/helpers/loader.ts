import ora from "ora";

async function showLoading() {
  let spinner: any;
  return {
    start: (message: string) => {
      spinner = ora(message + "\n").start();
    },
    stop: (successMessage?: string | null, errorMessage?: string | null) => {
      if (spinner) {
        if (errorMessage) {
          spinner.fail(errorMessage + "\n");
        } else {
          spinner.succeed(successMessage + "\n");
        }
      }
    },
  };
}

export default showLoading;
