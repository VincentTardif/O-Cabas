export default class APIError extends Error {
    // the APIError constructor will be called when we do "new APIError"
    constructor(err, code) {
        // call constructor of parent "new Error"
        super(err);

        this.code = code;
    }
}
