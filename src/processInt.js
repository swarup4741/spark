import chalk from "chalk";

export default function processInterruption() {
    if (process.platform === "win32") {
        require("readline")
            .createInterface({
                input: process.stdin,
                terminal: true
            })
            .on("SIGINT", function () {
                process.emit("SIGINT");
            });
    }

    process.on("SIGINT", function () {
        console.error(
            "\n",
            chalk.red.bold("ERROR"),
            "An unexpected interruption occured."
        );
        process.exit(0);
    });
}
