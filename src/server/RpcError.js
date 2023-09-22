import { ErrorMessages } from "./jsonrpc/response/ErrorCodes.js";

export * from "./jsonrpc/response/ErrorCodes.js";

export class RpcError extends Error {

    constructor(code, message) {
        super(message ?? ErrorMessages[code] ?? 'Unknown Error');
        this.code = code;
    }
}
