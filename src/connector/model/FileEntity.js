import AbstractEntity from "../../server/model/AbstractEntity.js";
import {EntityKind} from "./EntityKind.js";

export default class FileEntity extends AbstractEntity {

    constructor(xdip, systemName, parentXdip) {
        super(xdip, EntityKind.FILE, systemName, 'File', parentXdip);
    }

    get isContainer() {
        return false;
    }

    get hasContent() {
        return true;
    }
}