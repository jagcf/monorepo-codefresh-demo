import {RequestHandler} from 'express';

// Export a common healthcheck handler to be used by dependant servers
export const healtcheck: RequestHandler<{}> = async (req, res) => {
    res.json({
        status: "pass",
        info: "Service is healthy",
        time: new Date()
    });
};

// Install signal handler for SIGINT (so CTRL+C works)
process.on('SIGINT', function() {
    console.log("Caught SIGINT, exiting...");
    process.exit(1);
});
