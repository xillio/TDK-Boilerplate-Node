import { ErrorCodes, Method, ProtocolVersion, ProjectionScope, createErrorResponse } from "./index.js";

export function execute(body, service) {
    try {
        switch (body.method) {
            case Method.ENTITY_GET:
                const scope = body.params.requestParameters?.projectionScopes?.[0];
                switch (scope) {
                    case ProjectionScope.PATH_CHILDREN_REFERENCE:
                        return service.getChildrenReference(body.id, body.params);
                    case ProjectionScope.PATH_CHILDREN_ENTITY:
                        return service.getChildrenEntity(body.id, body.params);
                    default:
                        return service.get(body.id, body.params);
                }
            case Method.ENTITY_GET_BINARY:
                return service.getBinary(body.id, body.params);
            case Method.ENTITY_CREATE:
                return service.create(body.id, body.params);
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
