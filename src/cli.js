import chalk from "chalk";
import inquirer from "inquirer";
import helpLog from "./constants";
import bootstrapProject from "./main";
import processInterruption from "./processInt";
import { pkgJsonResponse } from "./packageJson";
import parseArgumentsIntoOptions from "./parseArguments";

async function promptForMissingOptions(options) {
    if (options.help) {
        helpLog();
        process.exit(0);
    }
    if (options.skipPrompts) {
        return options;
    }

    let questions = [];
    let skipAns;

    if (!options.initPackageJson) {
        questions.push({
            type: "confirm",
            name: "initPackageJson",
            message: "Create a Package.json file?",
            default: false
        });
    }

    const initPkgAns = await inquirer.prompt(questions);
    questions.pop();

    if (initPkgAns.initPackageJson || options.initPackageJson) {
        questions.push({
            type: "confirm",
            name: "skipToDefaults",
            message: "Skip to default package.json file?",
            default: true
        });

        skipAns = await inquirer.prompt(questions);
        questions.pop();

        if (!skipAns.skipToDefaults) {
            console.log(
                chalk.blue.bold("INFO"),
                "Overwrite or hit enter to accept default."
            );
            questions.push({
                type: "input",
                name: "packageName",
                message: "package name",
                default: pkgJsonResponse.name
            });
            questions.push({
                type: "input",
                name: "version",
                message: "version",
                default: pkgJsonResponse.version
            });
            questions.push({
                type: "input",
                name: "description",
                message: "description",
                default: pkgJsonResponse.description
            });
            questions.push({
                type: "input",
                name: "entry",
                message: "entry point",
                default: pkgJsonResponse.main
            });
            questions.push({
                type: "input",
                name: "repo",
                message: "repository url",
                default: pkgJsonResponse.repository
            });
            questions.push({
                type: "input",
                name: "author",
                message: "author of the project",
                default: pkgJsonResponse.author
            });
            questions.push({
                type: "input",
                name: "license",
                message: "license",
                default: pkgJsonResponse.license
            });
            questions.push({
                type: "confirm",
                name: "private",
                message: "private",
                default: pkgJsonResponse.private
            });

            const pkgAns = await inquirer.prompt(questions);

            pkgJsonResponse.name = pkgAns.packageName;
            pkgJsonResponse.version = pkgAns.version;
            pkgJsonResponse.description = pkgAns.description;
            pkgJsonResponse.main = pkgAns.entry;
            pkgJsonResponse.repository = pkgAns.repo;
            pkgJsonResponse.author = pkgAns.author;
            pkgJsonResponse.license = pkgAns.license;
            pkgJsonResponse.private = pkgAns.private;
        }
    }

    questions = [];

    if (!options.git) {
        questions.push({
            type: "confirm",
            name: "git",
            message: "Initialize a git repository?",
            default: false
        });
    }

    const gitAns = await inquirer.prompt(questions);

    return {
        ...options,
        git: options.git || gitAns.git,
        initPackageJson: options.initPackageJson || initPkgAns.initPackageJson,
        pkgEntries: pkgJsonResponse
    };
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    await bootstrapProject(options);
    const currentProcess = process.pid;
    if (currentProcess) {
        process.kill(currentProcess);
    }
}

processInterruption();
