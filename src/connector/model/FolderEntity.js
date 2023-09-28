import AbstractEntity from "../../server/model/AbstractEntity.js";
import {EntityKind} from "./EntityKind.js";

export default class FolderEntity extends AbstractEntity {

    constructor(xdip, systemName, parentXdip) {
        super(xdip, EntityKind.FOLDER, systemName, 'Folder', parentXdip);
    }

    get isContainer() {
        return true;
    }

    get hasContent() {
        return false;
    }
}