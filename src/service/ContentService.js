
export default class ContentService {

    get(_id, _params) {
        throw new Error(this.constructor.name + ` 'get' method not implemented.`);
    }

    create(_id, _params) {
        throw new Error(this.constructor.name + ` 'create' method not implemented.`);
    }

    update(_id, _params) {
        throw new Error(this.constructor.name + ` 'update' method not implemented.`);
    }

    delete(_id, _params) {
        throw new Error(this.constructor.name + ` 'delete' method not implemented.`);
    }

    getBinary(_id, _params) {
        throw new Error(this.constructor.name + ` 'get-binary' method not implemented.`);
    }

    updateBinary(_id, _params) {
        throw new Error(this.constructor.name + ` 'update-binary' method not implemented.`);
    }

    getContentTypes(_id, _params) {
        throw new Error(this.constructor.name + ` 'get-content-types' method not implemented.`);
    }

    getTemplates(_id, _params) {
        throw new Error(this.constructor.name + ` 'get-templates' method not implemented.`);
    }

    query(_id, _params) {
        throw new Error(this.constructor.name + ` 'query' method not implemented.`);
    }

    search(_id, _params) {
        throw new Error(this.constructor.name + ` 'query' method not implemented.`);
    }

    getRpcHandlers(_id, _params) {
        throw new Error(this.constructor.name + ` 'get-rpc-handlers' method not implemented.`);
    }

    invokeRpc(_id, _params) {
        throw new Error(this.constructor.name + ` 'invoke-rpc' method not implemented.`);
    }
}
