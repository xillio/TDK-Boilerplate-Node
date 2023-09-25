import {ErrorCodes} from "../jsonrpc/index.js";

/**
 * Throw this error when an unknown error occurred
 * while attempting to perform the requested operation.
 */
export default class ConnectorOperationFailedError extends Error {

    constructor(message) {
        super(message);
        this.code = ErrorCodes.CONNECTOR_OPERATION_FAILED;
    }
}
