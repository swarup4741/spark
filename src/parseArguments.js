import chalk from "chalk";
import arg from "arg";
import helpLog from "./constants";

export default function parseArgumentsIntoOptions(rawArgs) {
    if (!rawArgs.slice(2).length) {
        helpLog();
        process.exit(0);
    }
    const args = arg(
        {
            "--init": Boolean,
            "--git": Boolean,
            "--pkg": Boolean,
            "--yes": Boolean,
            "--help": Boolean,
            "-i": "--init",
            "-g": "--git",
            "-p": "--pkg",
            "-y": "--yes",
            "-h": "--help"
        },
        {
            argv: rawArgs.slice(2),
            permissive: true
        }
    );

    if (args._.length) {
        console.error(
            chalk.red.bold("ERROR"),
            "Unexpected or unknown option(s):",
            chalk.yellow(args._)
        );
        helpLog();
        process.exit(1);
    }

    return {
        help: args["--help"] || false,
        skipPrompts: args["--yes"] || false,
        git: args["--git"] || false,
        createProject: args["--init"] || false,
        initPackageJson: args["--pkg"] || false
    };
}
