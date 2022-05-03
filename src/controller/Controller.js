import { ErrorCodes, JsonRpcProtocolVersion, createErrorResponse, createSuccessResponse } from "../http/index.js";
import { validateJsonRpcHeader } from "../service/index.js";

export class Controller {

    // POST endpoint to handle any JSON RPC request.
    handleJsonRpcRequest(body) {
        try {
            // Validate query headers.
            validateJsonRpcHeader(body);
        } catch (err) {
            return createErrorResponse(
                JsonRpcProtocolVersion.V2_0,
                body.id ?? '',
                ErrorCodes.INVALID_QUERY,
                'Invalid request body',
                { reason: err.message });
        }

        return createSuccessResponse(
            JsonRpcProtocolVersion.V2_0,
            body.id,
            'Request successful');
    }
}
