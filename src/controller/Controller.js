import { validate, ProtocolVersion, createSuccessResponse } from "../jsonrpc/index.js";

export class Controller {

    // POST endpoint to handle any JSON RPC request.
    handleJsonRpcRequest(body) {
        const err = validate(body);
        if (err) return err;

        return createSuccessResponse(
            ProtocolVersion.V2_0,
            body.id,
            'Request successful');
    }
}
