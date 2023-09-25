import {ErrorCodes} from "../jsonrpc/index.js";

/**
 * Throw this error when the connector is not able to communicate
 * with the host which was set in the configuration.
 */
export default class HostNotReachedError extends Error {

    constructor(message) {
        super(message);
        this.code = ErrorCodes.HOST_NOT_REACHED;
    }
}
