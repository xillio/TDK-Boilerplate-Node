import { ErrorCodes, JsonRpcProtocolVersion, createErrorResponse, createSuccessResponse } from "../http/index.js";
import { validateRequestBody } from "../service/index.js";

export class Controller {

    // POST endpoint to handle any JSON RPC request.
    handleJsonRpcRequest(req, res) {
        try {
            validateRequestBody(req.body);
            res.status(200).send(createSuccessResponse(
                JsonRpcProtocolVersion.V2_0,
                req.body.id,
                'Request successful'));

        } catch (err) {
            res.status(200).send(createErrorResponse(
                JsonRpcProtocolVersion.V2_0,
                req.body.id ?? '',
                ErrorCodes.INVALID_QUERY,
                'Invalid request body',
                { reason: err.message }));
        }
    }
}
