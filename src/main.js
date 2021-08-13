import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import os from "os";
import { promisify } from "util";
import execa from "execa";
import ora from "ora";
import processInterruption from "./processInt";

const access = promisify(fs.access);
const copy = promisify(ncp);
const writeFile = promisify(fs.writeFile);

async function copyTemplateFiles(options) {
    try {
        await copy(options.projectTemplateDir, options.targetDir, {
            clobber: false
        });
    } catch (err) {
        return Promise.reject(new Error("Failed to copy the files"));
    }
    return;
}

async function createPackageJson(options) {
    const pkgJson = JSON.stringify(options.pkgEntries, null, 2);

    try {
        await writeFile(`${options.targetDir}/package.json`, pkgJson);
    } catch (err) {
        return Promise.reject(new Error("Failed to create Package.json"));
    }
    return;
}

async function initializeGit(options) {
    const { failed } = await execa("git", ["init"], {
        cwd: options.targetDir
    });

    if (failed) {
        return Promise.reject(new Error("Failed to initialize git"));
    }
    return;
}

export default async function bootstrapProject(options) {
    options = {
        ...options,
        targetDir: options.targetDir || process.cwd()
    };

    const fullPathName = new URL(import.meta.url).pathname;
    let projectTempDir;
    projectTempDir = path.resolve(fullPathName, "../../templates", "vanilla");

    // for windows platform

    if (os.platform() === "win32") {
        projectTempDir = projectTempDir.replace(/^(\w:\\)(\w:\\)/, "$2");
    }
    options.projectTemplateDir = projectTempDir;

    // checking wether template files exits

    try {
        await access(projectTempDir, fs.constants.R_OK);
    } catch (err) {
        console.error("%s Invalid Project Type", chalk.red.bold("ERROR"));
        process.exit(1);
    }

    // processes

    if (options.initPackageJson) {
        const s1 = ora("creating package.json file").start();
        await createPackageJson(options)
            .then(() => s1.succeed("Created Package.json file"))
            .catch(err => {
                console.error(chalk.red.bold("ERROR"), err.message);
                s1.fail("Failed to create package.json");
            });
    }

    const s2 = ora("Copying Template Files").start();
    await copyTemplateFiles(options)
        .then(() => s2.succeed("Copied Template Files"))
        .catch(err => {
            s2.fail("Failed to Copy Template Files");
            console.error(chalk.red.bold("ERROR"), err.message);
        });

    if (options.git) {
        const s3 = ora("Initializing git repository").start();
        await initializeGit(options)
            .then(() => s3.succeed("Initialized git repository"))
            .catch(err => {
                s3.fail("Failed to initialize git repository");
                console.error(chalk.red.bold("ERROR"), err.message);
            });
    }

    console.log(
        "\n",
        chalk.green.bold("SUCCESS"),
        "✨ Your Project is ready✨"
    );

    return true;
}

processInterruption();
