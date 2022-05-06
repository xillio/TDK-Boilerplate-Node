import { ErrorCodes, Method, ProtocolVersion, createErrorResponse } from "./index.js";

function isNumber(value) {
    return typeof value === 'number';
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

function getError(id, msg, code) {
    return createErrorResponse(
        ProtocolVersion.V2_0,
        id ?? '',
        code ?? ErrorCodes.INVALID_CONFIGURATION,
        msg ?? 'Invalid request body');
}

export function validate(body) {

    // Validate RPC header.
    if (!Object.values(ProtocolVersion).includes(body.jsonrpc))
        return getError(body.id, 'Unsupported or missing JSON-RPC protocol version');

    if (!isNumber(body.id) && !isString(body.id))
        return getError(body.id, 'Invalid or missing request identifier');

    if (!Object.values(Method).includes(body.method))
        return getError(body.id, 'Unsupported or missing JSON-RPC method');

    if (!isObject(body.params))
        return getError(body.id, 'Invalid or missing request parameters value');

    // Validate config parameter.
    if (body.params.config) {
        if (!isObject(body.params.config))
            return getError(body.id, 'Invalid config parameter');

        for (const c of Object.values(body.params.config))
            if (isArray(c) || isObject(c))
                return getError(body.id, 'Config parameter does not support array values or nested objects');
    }

    // Validate all other parameters.
    function validateXdip(params) {
        if (!isString(params.xdip))
            return getError(body.id, 'Invalid or missing XDIP parameter');
    }

    function validateRequestParameters(params) {
        if (params.requestParameters) {
            if (!isObject(params.requestParameters))
                return getError(body.id, 'Invalid request parameters');

            if (params.requestParameters.projectionScopes)
                if (!isArrayOf(params.requestParameters.projectionScopes, isString))
                    return getError(body.id, 'Invalid projection scopes parameter');

            if (params.requestParameters.projectionIncludes)
                if (!isArrayOf(params.requestParameters.projectionIncludes, isString))
                    return getError(body.id, 'Invalid projection includes parameter');

            if (params.requestParameters.projectionExcludes)
                if (!isArrayOf(params.requestParameters.projectionExcludes, isString))
                    return getError(body.id, 'Invalid projection excludes parameter');
        }
    }

    switch (body.method) {
        case Method.ENTITY_GET:
            return validateXdip(body.params) ?? validateRequestParameters(body.params);
        case Method.ENTITY_GET_BINARY:
            return validateXdip(body.params);

        // TODO: Validate all other methods as well.
    }
}
