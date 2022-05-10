import { ErrorCodes, EntityKind, Method, ProtocolVersion, ProjectionScope, createErrorResponse } from "./index.js";

function isNumber(value) {
    return typeof value === 'number';
}

function isBoolean(value) {
    return typeof value === 'boolean';
}

function isArray(value) {
    return Array.isArray(value);
}

function isArrayOf(value, fn) {
    return Array.isArray(value) && value.every(fn);
}

function isObject(value) {
    return typeof value === 'object' && !Array.isArray(value) && value !== null;
}

function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

function isDate(value) {
    return isString(value) && !isNaN(Date.parse(value));
}

export function validate(body) {

    function getError(msg, code, data) {
        return createErrorResponse(
            ProtocolVersion.V2_0,
            body.id ?? '',
            code ?? ErrorCodes.INVALID_CONFIGURATION,
            msg ?? 'Invalid request body',
            data);
    }

    // Validate RPC header.
    if (!Object.values(ProtocolVersion).includes(body.jsonrpc))
        return getError('Unsupported or missing JSON-RPC protocol version');

    if (!isNumber(body.id) && !isString(body.id))
        return getError('Invalid or missing request identifier');

    if (!Object.values(Method).includes(body.method))
        return getError('Unsupported or missing JSON-RPC method');

    if (!isObject(body.params))
        return getError('Invalid or missing request parameters value');

    // Validate config parameter.
    if (!isObject(body.params.config))
        return getError('Invalid or missing config parameter');

    for (const c of Object.values(body.params.config))
        if (isArray(c) || isObject(c))
            return getError('Config parameter does not support array values or nested objects');

    // Validate all other parameters.
    function validateXdip(params) {
        if (!isString(params.xdip))
            return getError('Invalid or missing XDIP parameter');

        // Validate XDIP as URL.
        const url = new URL(params.xdip);

        if (url.protocol !== 'xdip:')
            return getError('XDIP URLs must use the xdip: scheme');

        if (url.username || url.password)
            return getError('XDIP URLs cannot use user information');

        if (!url.hostname.match(/[a-zA-Z0-9][a-zA-Z0-9-]{0,253}[a-zA-Z0-9]/))
            return getError(
                'Configuration ids can only contain alphanumerics and dashes, ' +
                'cannot start or end with a dash and must be between 2 and 255 characters long');

        if (url.port)
            return getError('XDIP URLs cannot use port specifications');

        for (const [name, value] of url.searchParams.entries()) {
            if (!value)
                return getError('XDIP URLs cannot contain flags as query parameters.');

            if (!['language','version'].includes(name))
                return getError('XDIP URL contains invalid query parameters.');
        }

        if (url.hash)
            return getError('XDIP URLs cannot use fragment parameters');
    }

    function validateRequestParameters(params) {
        if (params.requestParameters) {
            if (!isObject(params.requestParameters))
                return getError('Invalid request parameters');

            if (params.requestParameters.projectionScopes) {
                if (!isArrayOf(params.requestParameters.projectionScopes, isString))
                    return getError('Invalid projection scopes parameter');

                // Here we just take the first element of projectionScopes.
                const scope = params.requestParameters.projectionScopes[0];
                if (scope && !Object.values(ProjectionScope).includes(scope))
                    return getError('Invalid or unsupported projection scope', ErrorCodes.NO_SUCH_SCOPE, { scope });
            }

            // Ignore projectionIncludes, projectionExcludes, offset and limit.
        }
    }

    function validateDecorator(name, params) {
        if (!isObject(params))
            return getError(`Invalid decorator: '` + name + `'`);

        switch (name) {
            case 'container':
                if (!isBoolean(params.hasChildren))
                    return getError('Invalid or missing hasChildren parameter of container decorator');

                break;

            case 'contentType':
                if (params.displayName && !isString(params.displayName))
                    return getError('Invalid displayName parameter of contentType decorator');

                if (!isString(params.systemName))
                    return getError('Invalid or missing systemName parameter of contentType decorator');

                break;

            case 'created':
                if (!isDate(params.date))
                    return getError('Invalid or missing date parameter of created decorator');

                break;

            case 'file':
                if (!isString(params.rawExtension))
                    return getError('Invalid or missing rawExtension parameter of file decorator');

                if (!isNumber(params.size))
                    return getError('Invalid or missing size parameter of file decorator');

                break;

            case 'language':
                if (!isString(params.tag))
                    return getError('Invalid or missing tag parameter of language decorator');

                if (params.translationOf && !isString(params.translationOf))
                    return getError('Invalid translationOf parameter of language decorator');

                break;

            case 'mimeType':
                if (!isString(params.type))
                    return getError('Invalid or missing type parameter of mimeType decorator');

                break;

            case 'modified':
                if (!isDate(params.date))
                    return getError('Invalid or missing date parameter of modified decorator');

                break;

            case 'name':
                if (params.displayName && !isString(params.displayName))
                    return getError('Invalid displayName parameter of name decorator');

                if (!isString(params.systemName))
                    return getError('Invalid or missing systemName parameter of name decorator');

                break;

            case 'parent':
                if (!isString(params.id))
                    return getError('Invalid or missing id parameter of parent decorator');

                break;

            // Ignore unknown decorators.
        }
    }

    function validateEntity(params) {
        if (!isObject(params.entity))
            return getError('Invalid or missing entity parameter');

        if (!Object.values(EntityKind).includes(params.entity.kind))
            return getError('Unsupported or missing entity kind parameter');

        if (!isObject(params.entity.original))
            return getError('Invalid or missing entity original parameter');

        for (const [name, decParams] of Object.entries(params.entity.original)) {
            const err = validateDecorator(name, decParams);
            if (err) return err;
        }
    }

    function validateBinaryContents(params) {
        if (params.binaryContents && !isString(params.binaryContents))
            return getError('Invalid binary contents parameter');
    }

    switch (body.method) {
        case Method.ENTITY_GET:
            return validateXdip(body.params) ?? validateRequestParameters(body.params);

        case Method.ENTITY_GET_BINARY:
            return validateXdip(body.params);

        case Method.ENTITY_CREATE:
            return validateRequestParameters(body.params) ?? validateEntity(body.params) ?? validateBinaryContents(body.params);
    }
}
