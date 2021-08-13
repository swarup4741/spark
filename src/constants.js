import pkg from "../package.json";

export default function helpLog() {
    console.log("Usage: spark --<flag>\n");
    console.log(`where <flag> is one of:
    init, yes, git, pkg, help
    `);
    console.log("spark --init | -i  creates a vanilla js project");
    console.log("spark --yes  | -y  skips to defaults");
    console.log("spark --git  | -g  initializes git repository");
    console.log("spark --pkg  | -p  creates package.json file");
    console.log("spark --help | -h  helping guide\n");
    console.log(`spark@${pkg.version}`);
    return;
}
