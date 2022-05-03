
export const JsonRpcMethod = {
    ENTITY_GET: "entity.get",
    ENTITY_CREATE: "entity.create",
    ENTITY_UPDATE: "entity.update",
    ENTITY_DELETE: "entity.delete",
    ENTITY_GET_BINARY: "entity.get-binary",
    ENTITY_UPDATE_BINARY: "entity.update-binary",
    ENTITY_GET_CONTENT_TYPES: "entity.get-content-types",
    ENTITY_GET_TEMPLATES: "entity.get-templates",
    ENTITY_QUERY: "entity.query",
    ENTITY_SEARCH: "entity.search",
    PROCEDURE_GET_RPC_HANDLERS: "procedure.get-rpc-handlers",
    PROCEDURE_INVOKE_RPC: "procedure.invoke-rpc"
};

export const JsonRpcMethodList = Object.values(JsonRpcMethod);
