import { ErrorCodes, EntityKind, Method, ProtocolVersion, ProjectionScope, createErrorResponse, createSuccessResponse } from "./index.js";
import mime from "mime-types";
import path from "node:path";

function asDate(value) {
    return (value instanceof Date) ? value : Date.parse(value);
}

function asEntity(input) {
    const isFile = !input.isFolder;
    const isFolder = input.isFolder;

    const decorators = {
        container: isFile ? undefined : {
            hasChildren: true
        },

        contentType: {
            systemName: isFile ? EntityKind.FILE : EntityKind.FOLDER
        },

        created: {
            date: asDate(input.created).toISOString()
        },

        language: isFolder ? undefined : {
            tag: 'en-US'
        },

        mimeType: isFolder ? undefined : {
            type: input.mimeType ?? (mime.lookup(input.systemName) || 'application/octet-stream')
        },

        file: isFolder ? undefined : {
            rawExtension: input.rawExtension ?? path.extname(input.systemName),
            size: input.size
        },

        modified: {
            date: asDate(input.modified).toISOString()
        },

        name: {
            displayName: input.displayName,
            systemName: input.systemName
        },

        parent: {
            id: path.dirname(input.xdip)
        }
    };

    return {
        id: input.xdip,
        xdip: input.xdip,
        kind: isFile ? EntityKind.FILE : EntityKind.FOLDER,
        original: decorators,
        modified: decorators
    }
}

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
                result = await service.getChildren(body.params.config, body.params.xdip);

                switch (scope) {
                    case ProjectionScope.PATH_CHILDREN_REFERENCE:
                        result = result.map(asEntity).map(c => { return { id: c.id, xdip: c.xdip } });
                        return getResponse({ [ProjectionScope.PATH_CHILDREN_REFERENCE]: result });

                    case ProjectionScope.PATH_CHILDREN_ENTITY:
                        result = result.map(asEntity);
                        return getResponse({ [ProjectionScope.PATH_CHILDREN_ENTITY]: result });

                    default:
                        result = await service.get(body.params.config, body.params.xdip);
                        return getResponse(asEntity(result));
                }

            case Method.ENTITY_GET_BINARY:
                result = await service.getBinary(body.params.config, body.params.xdip) ?? '';
                return getResponse(Buffer.from(result, 'utf8').toString('base64'));

            case Method.ENTITY_CREATE:
                result = await service.create(body.params.config, body.params.entity, body.params.binaryContents);
                return getResponse(result); // TODO: Prolly smth else.
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
