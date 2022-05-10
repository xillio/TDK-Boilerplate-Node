import AbstractService from "./AbstractService.js";
import { RpcError, ErrorCodes } from "../RpcError.js";
import { lstatSync, readFileSync } from "node:fs";

export default class FileService extends AbstractService {

    // XDIP (assumed to be valid) -> Path.
    fromXdip(xdip) {
        const url = new URL(xdip);

        // Validate configuration id.
        if ('/' + url.hostname !== this.appConfig.path)
            throw new RpcError('Configuration id unknown', ErrorCodes.INVALID_CONFIGURATION);

        return './contents' + url.pathname;
    }

    // Path (assumed to start with ./contents) -> XDIP.
    toXdip(path) {
        return 'xdip:/' + this.appConfig.path + path.slice(10);
    }

    get(_config, _xdip) {
        // TODO: Implement.
    }

    getChildrenReference(_config, _xdip) {
        // TODO: Implement.
    }

    getChildrenEntity(_config, _xdip) {
        // TODO: Implement.
    }

    getBinary(_config, xdip) {
        const path = this.fromXdip(xdip);

        // Check if it exists & if it is a file.
        const stat = lstatSync(path, { throwIfNoEntry: false });
        if (!stat)
            throw new RpcError('Entity does not exist', ErrorCodes.NO_SUCH_ENTITY);
        if (!stat.isFile())
            throw new RpcError('Entity not a file', ErrorCodes.NO_BINARY_CONTENT);

        // Read contents.
        const content = readFileSync(path, { encoding: 'utf8' });
        return Buffer.from(content, 'utf8').toString('base64');
    }

    create(_config, _entity, _binaryContents) {
        // TODO: Implement.
    }

    // TODO: Implement navigating/downloading, uploading as no-op.
    // TODO: Implement some security measure.
    // TODO: Define dockerfile.
}
