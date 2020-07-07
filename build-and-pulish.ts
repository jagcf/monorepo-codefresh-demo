/**
 * Build and publish all packages impacted by changes since the last publish
 */
import {getCommandOutput, runCommandSync} from "./util/shell";
import * as fs from "fs";
(async () => {

    // Fetch all packages that have changed since the last git tag (ie last publish) as well as any packages that
    // depend on them. Exclude dev tools since they're only used locally
   // const cmdJson = getCommandOutput(`npx lerna ls --toposort --include-merged-tags --include-dependents --ignore '@dev-tool/*' --json --since`)


   console.log("script started");
   console.log("collecing the changed shared libraries ..pacakges ubder the scope '@vgw-lib/*'");

    const cmdJson = getCommandOutput(`npx lerna ls --toposort  --scope='@vgw-lib/*' --ignore '@dev-tool/*' --json --since`)
     
    let packagesWithPendingChanges = JSON.parse((await cmdJson).stdout);

    let numPackages = packagesWithPendingChanges.length;

    // Print out what we'll be doing first, helpful for debugging
    console.log('='.repeat(80));
    console.log(`${numPackages} package(s) will be built and published`);
    packagesWithPendingChanges.forEach((pkg, idx) => console.log(`${(idx + 1).toString().padStart(3, ' ')}: ${pkg.name}`));
    console.log('='.repeat(80));

    packagesWithPendingChanges.forEach((pkg, idx) => {
        console.log(`Building ${pkg.name} v${pkg.version} [${idx + 1} of ${numPackages}]`);

        runCommandSync(`npx lerna exec --scope=${pkg.name} -- npm install`);    // Install dependencies
      //  runCommandSync(`npx lerna run unit-test --scope=${pkg.name}`);          // Unit tests
        runCommandSync(`npx lerna run build --scope=${pkg.name}`);              // Build/compile code

        runCommandSync(`cd ${pkg.location};npm publish`);  


        //runCommandSync(`npm publish`);  

      //  runCommandSync(`npx lerna run build-artifacts --scope=${pkg.name}`);    // Create deployable artifacts
      //  runCommandSync(`npx lerna run publish-artifacts --scope=${pkg.name}`);  // Publish artifacts



    //     "build-artifacts": "docker build -t chu-docker-local.jfrog.io/vgw036-app:v$(jq -r '.version' package.json) .",
    // "publish-artifacts": "docker push chu-docker-local.jfrog.io/vgw036-app:v$(jq -r '.version' package.json)",
    // "trigger-pipeline": "codefresh run chu-games/vgw036 -d -v INFRA_IMAGE=chu-docker-local.jfrog.io/vgw036-infra:v$(jq -r '.version' ../../../infrastructure/vgw036/package.json) -v APP_IMAGE=chu-docker-local.jfrog.io/vgw036-app:v$(jq -r '.version' package.json)"

    });

    console.log('='.repeat(80));
    console.log(`Successfully built and published ${numPackages} packages`);
    console.log('='.repeat(80));

    const cmdJsonWithDependents = getCommandOutput(`npx lerna ls --toposort  --scope='@vgw-app/*' --ignore '@dev-tool/*' --json --since`)
    const dependetsTriggersList = process.env.dptrigfilename || 'triggerList.json';

    packagesWithPendingChanges = JSON.parse((await cmdJsonWithDependents).stdout);
    numPackages = packagesWithPendingChanges.length;

    console.log('='.repeat(80));
    console.log(`${numPackages} dependent packages build pipeline will be triggered`);
    packagesWithPendingChanges.forEach((pkg, idx) => console.log(`${(idx + 1).toString().padStart(3, ' ')}: ${pkg.name}`));
    console.log('='.repeat(80));

    packagesWithPendingChanges.forEach(async (pkg, idx) => {
        console.log(`Trigger for  ${pkg.name} v${pkg.version} [${idx + 1} of ${numPackages}] is`);

       // let triggerOutput = getCommandOutput(`npx lerna run trigger --scope=${pkg.name}`)    // Install dependencies
        
      //  triggerOutput = getCommandOutput(`npx lerna run trigger --scope=${pkg.name} >> ${dependetsTriggersList}`) 
        
        // runCommandSync(`cd ${pkg.location};npm run trigger >>  ${dependetsTriggersList}`);  
        
        let packageListfile=`${pkg.location}/package.json`;
        
        console.log('packageListfile ',packageListfile);
        var contents = fs.readFileSync(packageListfile,"utf8") ;
        var dependendentPackageJson = JSON.parse(contents);
        console.log('trigger name is' ,dependendentPackageJson.triggerName);
        
//          let triggerOutputVal = (await triggerOutput).stdout;
//         console.log(`${pkg.name} trigger is ${triggerOutputVal}`)
     
        runCommandSync(`echo ${dependendentPackageJson.triggerName} >> ${dependetsTriggersList}`);              // Build/compile code

       
    });

    // If the --deploy arg was passed, we run the trigger-pipeline script in each package
    if (process.argv.includes('--deploy')) {
        packagesWithPendingChanges.forEach((pkg, idx) => {
            console.log(`Triggering pipeline for ${pkg.name} v${pkg.version} [${idx + 1} of ${numPackages}]`);

            runCommandSync(`npx lerna run trigger-pipeline --scope=${pkg.name}`);
        });
    }

})().catch(err => {
    console.error(err);
    process.exit(-1);
});

