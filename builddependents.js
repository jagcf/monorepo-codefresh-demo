const { exec } = require("child_process");
const testscript = exec("npx lerna ls --toposort --include-merged-tags --include-dependents --ignore '@dev-tool/*' --json --since > buildpackages.json");

// Define to JSON type

var fs = require("fs");
var contents = fs.readFileSync("dependent-changedpackages.json");
var packagesWithPendingChanges = JSON.parse(contents);


const numPackages = packagesWithPendingChanges.length;

// Print out what we'll be doing first, helpful for debugging
console.log('='.repeat(80));
console.log(`${numPackages} package(s) will be built and published`);
packagesWithPendingChanges.forEach((pkg, idx) => console.log(`${(idx + 1).toString().padStart(3, ' ')}: ${pkg.name}`));
console.log('='.repeat(80));

console.log("json", packagesWithPendingChanges)



console.log('='.repeat(80));
console.log(`Successfully built and published ${numPackages} packages`);
console.log('='.repeat(80));


packagesWithPendingChanges.forEach((pkg, idx) => {
    console.log(`Building ${pkg.name} v${pkg.version} [${idx + 1} of ${numPackages}]`);


    exec(`npx lerna exec --scope=${pkg.name} -- npm install`);

    exec(`npx lerna run build --scope=${pkg.name}`);
    // runCommandSync(`npx lerna run unit-test --scope=${pkg.name}`);          // Unit tests
    // runCommandSync(`npx lerna run build --scope=${pkg.name}`);              // Build/compile code
    // runCommandSync(`npx lerna run build-artifacts --scope=${pkg.name}`);    // Create deployable artifacts
    // runCommandSync(`npx lerna run publish-artifacts --scope=${pkg.name}`);  // Publish artifacts



    //     "build-artifacts": "docker build -t chu-docker-local.jfrog.io/vgw036-app:v$(jq -r '.version' package.json) .",
    // "publish-artifacts": "docker push chu-docker-local.jfrog.io/vgw036-app:v$(jq -r '.version' package.json)",
    // "trigger-pipeline": "codefresh run chu-games/vgw036 -d -v INFRA_IMAGE=chu-docker-local.jfrog.io/vgw036-infra:v$(jq -r '.version' ../../../infrastructure/vgw036/package.json) -v APP_IMAGE=chu-docker-local.jfrog.io/vgw036-app:v$(jq -r '.version' package.json)"

});


testscript.stdout.on('data', function (data) {
    console.log(data);
    // sendBackInfo();
});

testscript.stderr.on('data', function (data) {
    //console.log("some error");
    console.log(data);
    // triggerErrorStuff();
});
