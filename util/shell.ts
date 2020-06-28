import { exec, execSync, ExecSyncOptions } from 'child_process';
import { promisify } from 'util';

/**
 * Thin wrapper around child_process.execSync, with some default options set
 * @param cmd the command to run
 * @param opts an ExecSyncOptions object to pass to the execSync command
 */
export function runCommandSync(cmd: string, opts: ExecSyncOptions = {}) {
    const optsWithDefaults: ExecSyncOptions = {
        cwd: process.cwd(),
        stdio: 'inherit',
        ...opts
    };

    try {
        execSync(cmd, optsWithDefaults);
    } catch(e) {
        console.error(`An error was encountered while running ${cmd} in ${optsWithDefaults.cwd}`);
        console.error(e.stderr ? e.stderr.split("\n") : e);

        process.exit(e.status);
    }
}

/** Promisified version of childProcess.exec. */
export const getCommandOutput = promisify(exec);
