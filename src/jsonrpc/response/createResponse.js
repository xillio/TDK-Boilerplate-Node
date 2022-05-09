
export function createErrorResponse(jsonrpc, id, config, code, message, data) {
    return {
        jsonrpc,
        id,
        config,
        error: {
            code,
            message,
            data
        }
    };
}

export function createSuccessResponse(jsonrpc, id, config, result) {
    return {
        jsonrpc,
        id,
        config,
        result
    }
}
