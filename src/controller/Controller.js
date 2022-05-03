import { JsonRpcProtocolVersion, createSuccessResponse } from "../http/index.js";
import { validateJsonRpc } from "../service/index.js";

export class Controller {

    // POST endpoint to handle any JSON RPC request.
    handleJsonRpcRequest(body) {
        const err = validateJsonRpc(body);
        if (err) return err;

        return createSuccessResponse(
            JsonRpcProtocolVersion.V2_0,
            body.id,
            'Request successful');
    }
}
