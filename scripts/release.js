#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Require a bump type argument (e.g. "patch", "minor", "major").
const bumpType = process.argv[2];

if (!bumpType) {
  console.error(`
Error: Missing version bump type. 
Usage:
  node release.js patch
  node release.js minor
  node release.js major

Please specify a valid bump type.
`);
  process.exit(1);
}

try {
  // 1. Bump the version in projects/devkit.
  execSync(`cd projects/devkit && npm version ${bumpType}`, {
    stdio: "inherit",
  });

  // 2. Read the new version from projects/devkit/package.json.
  const devkitPackagePath = path.join(
    __dirname,
    "projects",
    "devkit",
    "package.json",
  );
  const devkitPackageJson = JSON.parse(
    fs.readFileSync(devkitPackagePath, "utf8"),
  );
  const version = devkitPackageJson.version;

  // 3. Commit and push changes.
  execSync("git add .", { stdio: "inherit" });
  execSync(`git commit -m "v${version}"`, { stdio: "inherit" });
  execSync("git push", { stdio: "inherit" });

  // 4. Create a new tag (e.g., v3.1.1) and push it.
  execSync(`git tag v${version}`, { stdio: "inherit" });
  execSync("git push --tags", { stdio: "inherit" });

  // 5. Build and publish.
  execSync(
    "rmdir /s /Q dist & ng build --project=devkit && cd dist/devkit && npm publish --access public && cd ../../",
    { stdio: "inherit" },
  );

  console.log(`Successfully released version v${version}!`);
} catch (error) {
  console.error("Error executing release steps:", error);
  process.exit(1);
}
