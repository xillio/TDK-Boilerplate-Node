export default class AbstractEntity {

    constructor(xdip, kind, systemName, contentType, parentXdip) {
        this._xdip = xdip;
        this._kind = kind;
        this._systemName = systemName;
        this._displayName = systemName;
        this._contentType = contentType;
        this._parentXdip = parentXdip;
        this._created = undefined;
        this._language = undefined;
        this._mimeType = undefined;
        this._rawExtension = undefined;
        this._size = undefined;
        this._modified = undefined;
    }

    /**
     * Returns boolean to indicate whether this entity is a container and can contain children entities.
     */
    get isContainer() {
        throw new Error(
            `Internal connector error. ${this.constructor.name} mandatory getter isContainer not implemented.`
        );
    }

    /**
     * Returns boolean to indicate whether this entity can have binary content.
     * Entities that can't have content won't be picked up by Lochub.
     */
    get hasContent() {
        throw new Error(
            `Internal connector error. ${this.constructor.name} mandatory getter hasContent not implemented.`
        );
    }

    get xdip() {
        return this._xdip;
    }

    get kind() {
        return this._kind;
    }

    get contentType() {
        return this._contentType;
    }

    get created() {
        return this._created;
    }

    get language() {
        return this._language;
    }

    get mimeType() {
        return this._mimeType;
    }

    get systemName() {
        return this._systemName;
    }

    get displayName() {
        return this._displayName;
    }

    get rawExtension() {
        return this._rawExtension;
    }

    get size() {
        return this._size;
    }

    get modified() {
        return this._modified;
    }

    get parentXdip() {
        return this._parentXdip;
    }

    set created(created) {
        this._created = created;
    }

    set language(language) {
        this._language = language;
    }

    set mimeType(mimeType) {
        this._mimeType = mimeType;
    }

    set displayName(displayName) {
        this._displayName = displayName;
    }

    set rawExtension(extension) {
        this._rawExtension = extension;
    }

    set size(size) {
        this._size = size;
    }

    set modified(modified) {
        this._modified = modified;
    }
}