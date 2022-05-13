
export default class AbstractService {

    constructor(config) {
        this.appConfig = config;
    }

    async get(_config, _xdip) {
        throw new Error(this.constructor.name + ` 'get' method not implemented`);
    }

    async getChildrenReference(_config, _xdip) {
        throw new Error(this.constructor.name + ` 'get' (path_children_reference) method not implemented`);
    }

    async getChildrenEntity(_config, _xdip) {
        throw new Error(this.constructor.name + ` 'get' (path_children_entity) method not implemented`);
    }

    async getBinary(_config, _xdip) {
        throw new Error(this.constructor.name + ` 'get-binary' method not implemented`);
    }

    async create(_config, _entity, _binaryContents) {
        throw new Error(this.constructor.name + ` 'create' method not implemented`);
    }
}
