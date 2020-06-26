const { exec } = require("child_process");


(async () => {

    exec("ls -la", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });



    exec(" npx lerna ls --toposort --include-merged-tags --include-dependents --ignore '@dev-tool/*' --json --since", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
   

})().catch(err => {
    console.error(err);
    process.exit(-1);
});
