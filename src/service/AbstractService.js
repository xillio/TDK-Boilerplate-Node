
export default class AbstractService {

    get(_config, _xdip) {
        throw new Error(this.constructor.name + ` 'get' method not implemented`);
    }

    getChildrenReference(_config, _xdip) {
        throw new Error(this.constructor.name + ` 'get' (path_children_reference) method not implemented`);
    }

    getChildrenEntity(_config, _xdip) {
        throw new Error(this.constructor.name + ` 'get' (path_children_entity) method not implemented`);
    }

    getBinary(_config, _xdip) {
        throw new Error(this.constructor.name + ` 'get-binary' method not implemented`);
    }

    create(_config, _entity, _binaryContents) {
        throw new Error(this.constructor.name + ` 'create' method not implemented`);
    }
}
