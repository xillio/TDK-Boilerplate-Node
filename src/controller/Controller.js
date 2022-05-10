import { validate, execute, ErrorCodes, ProtocolVersion, createErrorResponse } from "../jsonrpc/index.js";

export class Controller {

    constructor(service) {
        this.service = service;
    }

    // POST endpoint to handle any JSON RPC request.
    handleJsonRpcRequest(body) {
        const err = validate(body);
        if (err) return err;

        const res = execute(body, this.service);
        if (res) return res;

        return createErrorResponse(
            ProtocolVersion.V2_0,
            body.id,
            ErrorCodes.CONNECTOR_OPERATION_FAILED,
            'Controller failed to execute JSON RPC');
    }
}
