import ora from "ora";
async function showLoading() {
    let spinner;
    return {
        start: (message) => {
            spinner = ora(message + "\n").start();
        },
        stop: (successMessage, errorMessage) => {
            if (spinner) {
                if (errorMessage) {
                    spinner.fail(errorMessage + "\n");
                }
                else {
                    spinner.succeed(successMessage + "\n");
                }
            }
        },
    };
}
export default showLoading;
