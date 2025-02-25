#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const ansis = require("ansis");

// Check if valid bump type is specified
const bumpType = process.argv[2];

if (!bumpType) {
  console.error(`${ansis.redBright.bold("✕")}
Error: Missing version bump type. 
Usage:
  pnpm release patch
  pnpm release minor
  pnpm release major

Please specify a valid bump type.
`);
  process.exit(1);
}

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

  execSync(`cd projects/devkit && npm version ${bumpType}`, {
    stdio: "ignore",
  });
  const newVersion = readVersion();

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
  execSync(
    "ng build --project=devkit && cd dist/devkit && npm publish --access public && cd ../../",
    { stdio: "ignore" },
  );

  console.log(
    `${ansis.greenBright.bold("✓")} Successfully released version ${ansis.blueBright.underline(newVersion)}!`,
  );
} catch (error) {
  console.error("Error executing release steps:", error);
  process.exit(1);
}
