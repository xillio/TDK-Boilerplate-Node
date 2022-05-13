import AbstractService from "./AbstractService.js";
import { RpcError, ErrorCodes } from "../RpcError.js";
import fs from "fs";

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

    async get(_config, _xdip) {
        // TODO: Implement.
    }

    async getChildrenReference(_config, _xdip) {
        // TODO: Implement.
    }

    async getChildrenEntity(_config, _xdip) {
        // TODO: Implement.
    }

    async getBinary(_config, xdip) {
        const path = this.fromXdip(xdip);

        // Check if it exists & if it is a file.
        let stat;
        try {
            stat = await fs.promises.lstat(path);
        } catch (_err) {
            throw new RpcError('Entity does not exist', ErrorCodes.NO_SUCH_ENTITY);
        }

        if (!stat.isFile())
            throw new RpcError('Entity not a file', ErrorCodes.NO_BINARY_CONTENT);

        // Read contents.
        const content = await fs.promises.readFile(path, { encoding: 'utf8' });
        return Buffer.from(content, 'utf8').toString('base64');
    }

    async create(_config, _entity, _binaryContents) {
        // TODO: Implement.
    }

    // TODO: Implement navigating/downloading, uploading as no-op.
    // TODO: Implement some security measure.
    // TODO: Define dockerfile.
}
