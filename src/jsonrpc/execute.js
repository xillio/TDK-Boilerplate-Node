import { ErrorCodes, Method, ProtocolVersion, ProjectionScope, createErrorResponse, createSuccessResponse } from "./index.js";

export function execute(body, service) {

    function getResponse(result) {
        return createSuccessResponse(
            ProtocolVersion.V2_0,
            body.id,
            body.params.config,
            result ?? {});
    }

    // Try to execute it and properly respond.
    try {
        switch (body.method) {
            case Method.ENTITY_GET:
                const scope = body.params.requestParameters?.projectionScopes?.[0];
                switch (scope) {
                    case ProjectionScope.PATH_CHILDREN_REFERENCE:
                        return getResponse(service.getChildrenReference(body.params.config, body.params.xdip));

                    case ProjectionScope.PATH_CHILDREN_ENTITY:
                        return getResponse(service.getChildrenEntity(body.params.config, body.params.xdip));

                    default:
                        return getResponse(service.get(body.params.config, body.params.xdip));
                }

            case Method.ENTITY_GET_BINARY:
                return getResponse(service.getBinary(body.params.config, body.params.xdip) ?? '');

            case Method.ENTITY_CREATE:
                return getResponse(service.create(body.params.config, body.params.entity, body.params.binaryContents));
        }

    } catch (err) {
        // Some error within the connector's implementation.
        return createErrorResponse(
            ProtocolVersion.V2_0,
            body.id,
            body.params.config,
            err.code ?? ErrorCodes.CONNECTOR_OPERATION_FAILED,
            err.message);
    }
}
