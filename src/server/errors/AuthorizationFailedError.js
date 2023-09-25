import {ErrorCodes} from "../jsonrpc/index.js";

/**
 * Throw this error when performing an action for which you are not authorized by the target system,
 * or when the configuration contains invalid credentials.
 */
export default class AuthorizationFailedError extends Error {

    constructor(message) {
        super(message);
        this.code = ErrorCodes.AUTHORIZATION_FAILED;
    }
}
