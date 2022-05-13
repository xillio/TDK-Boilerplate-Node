import AbstractService from "./AbstractService.js";
import { RpcError, ErrorCodes } from "../RpcError.js";

import fs from "node:fs";
import path from "node:path";

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

    async validate(_config) {
        // TODO: Implement.
        return true;
    }

    async authorize(_config) {
        // TODO: Implement.
        return true;
    }

    async get(_config, xdip) {
        const xPath = this.fromXdip(xdip);

        // Check if it exists.
        let stat;
        try {
            stat = await fs.promises.lstat(xPath);
        } catch (_err) {
            throw new RpcError('Entity does not exist', ErrorCodes.NO_SUCH_ENTITY);
        }

        // Output data.
        return {
            xdip: xdip,
            isFolder: stat.isDirectory(),
            created: stat.birthtime,
            modified: stat.mtime,
            systemName: path.basename(xPath),
            rawExtension: path.extname(xPath),
            size: stat.size
        };
    }

    async getChildrenReference(_config, _xdip) {
        // TODO: Implement.
    }

    async getChildrenEntity(_config, _xdip) {
        // TODO: Implement.
    }

    async getBinary(_config, xdip) {
        const xPath = this.fromXdip(xdip);

        // Check if it exists & if it is a file.
        let stat;
        try {
            stat = await fs.promises.lstat(xPath);
        } catch (_err) {
            throw new RpcError('Entity does not exist', ErrorCodes.NO_SUCH_ENTITY);
        }

        if (!stat.isFile())
            throw new RpcError('Entity not a file', ErrorCodes.NO_BINARY_CONTENT);

        // Read contents.
        return await fs.promises.readFile(xPath, { encoding: 'utf8' });
    }

    async create(_config, _entity, _binaryContents) {
        // TODO: Implement.
    }

    // TODO: Implement navigating/downloading, uploading as no-op.
    // TODO: Implement some security measure.
    // TODO: Define dockerfile.
}
