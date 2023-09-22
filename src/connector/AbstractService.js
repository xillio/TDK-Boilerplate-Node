
export default class AbstractService {

    constructor(config) {
        if (this.constructor.name === AbstractService.name)
            throw new Error(`Cannot make an instance of '` + AbstractService.name + `'`);

        this.appConfig = config;
    }

    async validate(_config) {
        throw new Error(this.constructor.name + ` 'validate' not implemented`);
    }

    async authorize(_config) {
        throw new Error(this.constructor.name + ` 'authorize' not implemented`);
    }

    async get(_config, _xdip) {
        throw new Error(this.constructor.name + ` 'get' method not implemented`);
    }

    async getChildren(_config, _xdip) {
        throw new Error(this.constructor.name + ` 'get' (path_children_*) method not implemented`);
    }

    async getBinary(_config, _xdip) {
        throw new Error(this.constructor.name + ` 'get-binary' method not implemented`);
    }

    async create(_config, _entity, _binaryContents) {
        throw new Error(this.constructor.name + ` 'create' method not implemented`);
    }
}
