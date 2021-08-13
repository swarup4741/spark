let currentDir;
let splitChar;
if (process.platform === "win32") splitChar = "\\";
else splitChar = "/";
currentDir = process.cwd().split(splitChar);
currentDir = currentDir[currentDir.length - 1];

// Default package.json file

export const pkgJsonResponse = {
    name: currentDir,
    version: "1.0.0",
    description: "",
    main: "src/app.js",
    repository: "",
    author: "",
    license: "MIT",
    private: false
};
