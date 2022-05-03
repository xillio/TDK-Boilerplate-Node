import { JsonRpcMethodList, JsonRpcProtocolVersionList } from "../http/index.js";

function isObject(value) {
    return typeof value === 'object' && !Array.isArray(value) && value !== null;
}

function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

export function validateJsonRpcHeader(body) {
    if (!JsonRpcProtocolVersionList.includes(body.jsonrpc))
        throw new Error('Unsupported or missing JSON-RPC protocol version');

    if (!isString(body.id))
        throw new Error('Invalid or missing request identifier string');

    if (!JsonRpcMethodList.includes(body.method))
        throw new Error('Unsupported or missing JSON-RPC method');

    if (!isObject(body.params))
        throw new Error('Invalid or missing request parameters value');
}
