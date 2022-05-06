
export * from "./jsonrpc/response/ErrorCodes.js";

export class RpcError extends Error {

    constructor(message, code) {
        super(message);
        this.code = code;
    }
}
