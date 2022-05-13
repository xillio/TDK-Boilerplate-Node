import { ErrorCodes, Method, ProtocolVersion, ProjectionScope, createErrorResponse, createSuccessResponse } from "./index.js";

export async function execute(body, service) {

    function getResponse(result) {
        return createSuccessResponse(
            ProtocolVersion.V2_0,
            body.id,
            result ?? {});
    }

    try {
        // Firstly validate & authorize.
        if (!(await service.validate(body.params.config)))
            return createErrorResponse(
                ProtocolVersion.V2_0,
                body.id,
                ErrorCodes.INVALID_CONFIGURATION,
                'Invalid config parameter');

        if (!(await service.authorize(body.params.config)))
            return createErrorResponse(
                ProtocolVersion.V2_0,
                body.id,
                ErrorCodes.AUTHORIZATION_FAILED,
                'Failed to authorize request');

        // Try to execute it and properly respond.
        let result;
        switch (body.method) {
            case Method.ENTITY_GET:
                const scope = body.params.requestParameters?.projectionScopes?.[0];
                switch (scope) {
                    case ProjectionScope.PATH_CHILDREN_REFERENCE:
                        return getResponse(await service.getChildrenReference(body.params.config, body.params.xdip));

                    case ProjectionScope.PATH_CHILDREN_ENTITY:
                        return getResponse(await service.getChildrenEntity(body.params.config, body.params.xdip));

                    default:
                        return getResponse(await service.get(body.params.config, body.params.xdip));
                }

            case Method.ENTITY_GET_BINARY:
                result = await service.getBinary(body.params.config, body.params.xdip) ?? '';
                return getResponse(Buffer.from(result, 'utf8').toString('base64'));

            case Method.ENTITY_CREATE:
                return getResponse(await service.create(body.params.config, body.params.entity, body.params.binaryContents));
        }

    } catch (err) {
        // Some error within the connector's implementation.
        return createErrorResponse(
            ProtocolVersion.V2_0,
            body.id,
            err.code ?? ErrorCodes.CONNECTOR_OPERATION_FAILED,
            err.message);
    }
}
