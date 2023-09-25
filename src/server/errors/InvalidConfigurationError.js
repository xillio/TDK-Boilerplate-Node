import {ErrorCodes} from "../jsonrpc/index.js";

/**
 * Throw this error when the provided configuration static validation fails.
 * For example, it is missing a mandatory value, combination of the provided values
 * is invalid, etc.
 */
export default class InvalidConfigurationError extends Error {

    constructor(message) {
        super(message);
        this.code = ErrorCodes.INVALID_CONFIGURATION;
    }
}
