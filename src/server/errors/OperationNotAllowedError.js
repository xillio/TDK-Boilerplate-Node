import {ErrorCodes} from "../jsonrpc/index.js";

/**
 * Throw this error when performing an operation that cannot complete
 * due to target system limitations.
 * For example, target language is unknown to the target system.
 */
export default class OperationNotAllowedError extends Error {

    constructor(message) {
        super(message);
        this.code = ErrorCodes.OPERATION_NOT_ALLOWED;
    }
}
