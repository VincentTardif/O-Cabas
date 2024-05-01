import debug from "debug";
import { access, constants, appendFile } from 'node:fs/promises';
import path from "path";
import APIError from "./APIError.js";

const errorService = {
    /**
     * Error management
     */
    manageError(err, req, res, _) {
        // If we are in debug mode, we display the error in the terminal
        debug("api:error")(err);

        // Writing to the log file
        errorService.logError(err, req.url);

        // Sending the API response, informing the user
        res.status(err.code).json(err.message);
    },
    /**
     * Recording the error in a .log file
     * @param {*} err 
     */
    async logError(err, url) {
        // Does the file exist?
        // if it doesn't, we need to create it with Headers
        const logPath = "../../../log/";
        const fileName = "2024-02-21.log";
        let fileExist = false;

        /* path is an internal module that allows manipulating paths
         * path.join generates an absolute path from provided small pieces as arguments
         * __dirname contains the absolute path of the directory where I am located
         * 
         * the mixture between the absolute path up to this directory + the relative path to the file will give me the absolute path to the file
         */
        const filePath = path.join(new URL(import.meta.url).pathname, logPath + fileName);

        try {
            await access(filePath, constants.R_OK);
            console.log('can access');

            // the file already exists, I set "fileExist" to "true"
            fileExist = true;
        } catch (err) {
            debug("api:error")(err);
            console.error('cannot access');
        }

        // does the file exist?
        if (!fileExist) {
            const content = "Time;Url;Message;StackTrace;\n";

            // I create the file with the headers
            await appendFile(filePath, content);
        }

        const errorContent = `${new Date().toTimeString()};${url};${err.message};${err.stack}\n`;
        // I add a new line for the error
        await appendFile(filePath, errorContent);
    },
    _404(req, res, next) {
        next(new APIError("Url not found", 404));
    }
};

export default errorService;
