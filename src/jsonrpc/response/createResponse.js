
export function createErrorResponse(jsonrpc, id, code, message, data) {
    return {
        jsonrpc,
        id,
        error: {
            code,
            message,
            data
        }
    };
}

export function createSuccessResponse(jsonrpc, id, result) {
    return {
        jsonrpc,
        id,
        result
    }
}
