import {ErrorCodes} from "../jsonrpc/index.js";

/**
 * Throw this error when the requested entity could not be found.
 * Throw this error also when the XDIP provided does not match the format a connector expected.
 */
export default class NoSuchEntityError extends Error {

    constructor(xdip) {
        super(`No entity was found at ${xdip}`);
        this.code = ErrorCodes.NO_SUCH_ENTITY;
    }
}
