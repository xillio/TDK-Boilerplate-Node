import {ErrorCodes} from "../jsonrpc/index.js";

export default class NoBinaryContentError extends Error {

    constructor(xdip) {
        super(`Entity ${xdip} can\'t have binary content.`);
        this.code = ErrorCodes.NO_BINARY_CONTENT;
    }
}