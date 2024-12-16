import ora from "ora";
async function showLoading() {
    let spinner;
    return {
        start: (message) => {
            spinner = ora(message + "\n").start();
        },
        stop: () => {
            spinner.stop();
        },
        success: (successMessage) => {
            if (spinner) {
                spinner.stop();
                spinner.succeed(successMessage);
            }
        },
        fail: (errorMessage) => {
            if (spinner) {
                spinner.stop();
                spinner.fail(errorMessage + "\n");
            }
        },
    };
}
export default showLoading;
