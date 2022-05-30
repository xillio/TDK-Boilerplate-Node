import { ErrorCodes, EntityKind, Method, ProtocolVersion, ProjectionScope, createErrorResponse, createSuccessResponse } from "./index.js";
import mime from "mime-types";
import path from "node:path";

function asDate(value) {
    const date = (value instanceof Date) ? value : Date.parse(value);
    return (date instanceof Date) ? date : new Date();
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
            rawExtension: input.rawExtension ?? path.extname(input.systemName ?? ''),
            size: input.size ?? 0
        },

        modified: {
            date: asDate(input.modified).toISOString()
        },

        name: {
            displayName: input.displayName,
            systemName: input.systemName
        },

        parent: {
            id: path.dirname(input.xdip ?? '')
        }
    };

    return {
        id: input.xdip ?? '',
        xdip: input.xdip ?? '',
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

    // 'entity.get'
    async function entityGet() {
        let scope = body.params.requestParameters?.projectionScopes?.[0];
        let result;

        // Check scope and build response accordingly.
        switch (scope) {
            case ProjectionScope.PATH_CHILDREN_REFERENCE:
                result = await service.getChildren(body.params.config, body.params.xdip);
                result = result.map(asEntity).map(({ id }) => { return { id }});
                break;

            case ProjectionScope.PATH_CHILDREN_ENTITY:
                result = await service.getChildren(body.params.config, body.params.xdip);
                result = result.map(asEntity);
                break;

            default:
                result = await service.get(body.params.config, body.params.xdip);
                result = asEntity(result);
                scope = ProjectionScope.ENTITY; // In case it is undefined.
                break;
        }

        return { [scope]: result };
    }

    // 'entity.get-binary'
    async function entityGetBinary() {
        const result = await service.getBinary(body.params.config, body.params.xdip);
        return Buffer.from(result ?? '', 'utf8').toString('base64');
    }

    // 'entity.create'
    async function entityCreate() {
        const bin = Buffer.from(body.params.binaryContents ?? '', 'base64').toString('utf8');
        const result = await service.create(body.params.config, body.params.entity, bin);
        return { entity: asEntity(result) };
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
        switch (body.method) {
            case Method.ENTITY_GET:
                return getResponse(await entityGet());

            case Method.ENTITY_GET_BINARY:
                return getResponse(await entityGetBinary());

            case Method.ENTITY_CREATE:
                return getResponse(await entityCreate());

            // Default is to return nothing.
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
