
export default class ContentService {

    get(_id, _params) {
        throw new Error(this.constructor.name + ` 'get' method not implemented.`);
    }

    getChildrenReference(_id, _params) {
        throw new Error(this.constructor.name + ` 'get' (path_children_reference) method not implemented.`);
    }

    getChildrenEntity(_id, _params) {
        throw new Error(this.constructor.name + ` 'get' (path_children_entity) method not implemented.`);
    }

    getBinary(_id, _params) {
        throw new Error(this.constructor.name + ` 'get-binary' method not implemented.`);
    }

    create(_id, _params) {
        throw new Error(this.constructor.name + ` 'create' method not implemented.`);
    }
}
