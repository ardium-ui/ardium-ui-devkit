#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const ansis = require("ansis");
const inquirer = require("inquirer").default;

(async () => {
  let bumpType = process.argv[2];

  const preVersions = ["prerelease", "prepatch", "preminor", "premajor"];
  const allowedBumpTypes = [
    "patch",
    "minor",
    "major",
    ...preVersions,
    "no-version",
  ];

  if (!bumpType || !allowedBumpTypes.includes(bumpType)) {
    const anwsers = await inquirer.prompt([
      {
        type: "list",
        name: "bumpType",
        message: "Select version bump type: ",
        choices: allowedBumpTypes,
        default: "patch",
      },
    ]);
    bumpType = anwsers.bumpType;
  }

  const isAlphaBump = preVersions.includes(bumpType);
  const isNoVersionBump = bumpType === "no-version";

  let startTime = new Date();

  // Check if all changes are committed
  try {
    execSync("git diff-index --quiet HEAD --");
    console.log(
      `${ansis.greenBright.bold("✓")} No uncommmitted changes. Proceeding... (${new Date().valueOf() - startTime.valueOf()} ms)`,
    );
  } catch (error) {
    console.error(
      `${ansis.redBright.bold("✕")} Error: You have uncommitted changes. Please commit or stash them first.`,
    );
    process.exit(1);
  }

  const rootDir = path.join(__dirname, "..");

  function readVersion() {
    const devkitPackagePath = path.join(
      rootDir,
      "projects",
      "devkit",
      "package.json",
    );
    const devkitPackageJson = JSON.parse(
      fs.readFileSync(devkitPackagePath, "utf8"),
    );
    return devkitPackageJson.version;
  }

  try {
    // Bump the package version
    const oldVersion = readVersion();
    let finalVersion = oldVersion;

    if (!isNoVersionBump) {
      const versionToBeSet = isAlphaBump
        ? bumpType + " --preid=alpha"
        : bumpType;
      
      execSync(`cd projects/devkit && npm version ${versionToBeSet}`, {
        stdio: "ignore",
      });
      const newVersion = readVersion();
      finalVersion = newVersion;

      console.log(
        `${ansis.greenBright.bold("✓")} Changed version from ${ansis.redBright.underline(oldVersion)} -> ${ansis.blueBright.underline(newVersion)} (${new Date().valueOf() - startTime.valueOf()} ms)`,
      );
      startTime = new Date();

      // Commit and push changes
      execSync("git add .", { stdio: "ignore" });
      execSync(`git commit -m "v${newVersion}"`, { stdio: "ignore" });
      execSync("git push", { stdio: "ignore" });

      console.log(
        `${ansis.greenBright.bold("✓")} Committed and pushed changes (${new Date().valueOf() - startTime.valueOf()} ms)`,
      );
      startTime = new Date();

      // Create a new tag and push it
      execSync(`git tag v${newVersion}`, { stdio: "ignore" });
      execSync("git push --tags", { stdio: "ignore" });

      console.log(
        `${ansis.greenBright.bold("✓")} Created a version tag (${new Date().valueOf() - startTime.valueOf()} ms)`,
      );
    } else {
      console.log(
        `${ansis.greenBright.bold("✓")} Skipping version bump. Current version: ${ansis.blueBright.underline(oldVersion)} (${new Date().valueOf() - startTime.valueOf()} ms)`,
      );
    }
    startTime = new Date();

    // Cleanup
    if (fs.existsSync(path.join(rootDir, "dist"))) {
      execSync("rmdir /s /Q dist", { stdio: "ignore" });

      console.log(
        `${ansis.greenBright.bold("✓")} Cleaned up dist directory (${new Date().valueOf() - startTime.valueOf()} ms)`,
      );
    } else {
      console.log(
        `${ansis.yellowBright.bold("-")} Nothing to clean up (${new Date().valueOf() - startTime.valueOf()} ms)`,
      );
    }

    // Build and publish
    execSync("ng build --project=devkit", { stdio: "inherit" });
    execSync(`cd dist/devkit && npm publish --access public${isAlphaBump ? ' --tag alpha' : ''}`, {
      stdio: "inherit",
    });

    console.log(
      `\n${ansis.greenBright.bold("✓")} Successfully released version ${ansis.blueBright.underline(finalVersion)}!`,
    );
  } catch (error) {
    console.error("Error executing release steps:", error);
    process.exit(1);
  }
})();
