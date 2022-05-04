import { ErrorCodes, Method, ProtocolVersion, createErrorResponse } from "./index.js";

export function execute(body, service) {
    try {
        switch (body.method) {
            case Method.ENTITY_GET:
                return service.get(body.id, body.params);
            case Method.ENTITY_CREATE:
                return service.create(body.id, body.params);
            case Method.ENTITY_UPDATE:
                return service.update(body.id, body.params);
            case Method.ENTITY_DELETE:
                return service.delete(body.id, body.params);
            case Method.ENTITY_GET_BINARY:
                return service.getBinary(body.id, body.params);
            case Method.ENTITY_UPDATE_BINARY:
                return service.updateBinary(body.id, body.params);
            case Method.ENTITY_GET_CONTENT_TYPES:
                return service.getContentTypes(body.id, body.params);
            case Method.ENTITY_GET_TEMPLATES:
                return service.getTemplates(body.id, body.params);
            case Method.ENTITY_QUERY:
                return service.query(body.id, body.params);
            case Method.ENTITY_SEARCH:
                return service.search(body.id, body.params);
            case Method.PROCEDURE_GET_RPC_HANDLERS:
                return service.getRpcHandlers(body.id, body.params);
            case Method.PROCEDURE_INVOKE_RPC:
                return service.invokeRpc(body.id, body.params);
        }

    } catch (err) {
        // Some error within the connector's implementation.
        return createErrorResponse(
            ProtocolVersion.V2_0,
            body.id,
            ErrorCodes.CONNECTOR_OPERATION_FAILED,
            err.message);
    }
}
