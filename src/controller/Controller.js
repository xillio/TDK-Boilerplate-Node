import { ErrorCodes, JsonRpcProtocolVersion, createErrorResponse, createSuccessResponse } from "../http/index.js";
import { validateRequestBody } from "../service/index.js";

export class Controller {

    // POST endpoint to handle any JSON RPC request.
    handleJsonRpcRequest(body) {
        try {
            validateRequestBody(body);
            return createSuccessResponse(
                JsonRpcProtocolVersion.V2_0,
                body.id,
                'Request successful');

        } catch (err) {
            return createErrorResponse(
                JsonRpcProtocolVersion.V2_0,
                body.id ?? '',
                ErrorCodes.INVALID_QUERY,
                'Invalid request body',
                { reason: err.message });
        }
    }
}
