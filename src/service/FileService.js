import AbstractService from "./AbstractService.js";
import { RpcError, ErrorCodes } from "../RpcError.js";

import fs from "node:fs";
import path from "node:path";

export default class FileService extends AbstractService {

    // XDIP + child (both assumed to be valid) -> child XDIP.
    childXdip(xdip, child) {
        return xdip.endsWith('/') ? xdip + child : xdip + '/' + child;
    }

    // XDIP (assumed to be valid) -> Path.
    fromXdip(xdip) {
        const url = new URL(xdip);

        return './contents' + url.pathname;
    }

    // Path (assumed to start with ./contents/) -> XDIP.
    toXdip(xPath) {
        return 'xdip:/' + this.appConfig.path + xPath.slice(10);
    }

    async validate(_config) {
        return true;
    }

    async authorize(_config) {
        return true;
    }

    async get(_config, xdip) {
        const xPath = this.fromXdip(xdip);

        // Check if it exists.
        let stat;
        try {
            stat = await fs.promises.lstat(xPath);
        } catch (_err) {
            throw new RpcError(ErrorCodes.NO_SUCH_ENTITY);
        }

        // Output data.
        return {
            xdip: xdip,
            isFolder: stat.isDirectory(),
            created: stat.birthtime,
            modified: stat.mtime,
            systemName: path.basename(xPath),
            size: stat.size
        };
    }

    async getChildren(_config, xdip) {
        const xPath = this.fromXdip(xdip);

        // Check if it exists.
        let stat;
        try {
            stat = await fs.promises.lstat(xPath);
        } catch (_err) {
            throw new RpcError(ErrorCodes.NO_SUCH_ENTITY);
        }

        // No folder == no children.
        if (!stat.isDirectory()) return [];

        // Output all child data.
        const children = await fs.promises.readdir(xPath);
        return Promise.all(children.map(async (child) => {
            const xdipChild = this.childXdip(xdip, child);
            const pathChild = this.fromXdip(xdipChild);
            const statChild = await fs.promises.lstat(pathChild);

            return {
                xdip: xdipChild,
                isFolder: statChild.isDirectory(),
                created: statChild.birthtime,
                modified: statChild.mtime,
                systemName: path.basename(child),
                size: statChild.size
            }
        }));
    }

    async getBinary(_config, xdip) {
        const xPath = this.fromXdip(xdip);

        // Check if it exists & if it is a file.
        let stat;
        try {
            stat = await fs.promises.lstat(xPath);
        } catch (_err) {
            throw new RpcError(ErrorCodes.NO_SUCH_ENTITY);
        }

        if (!stat.isFile())
            throw new RpcError(ErrorCodes.NO_BINARY_CONTENT);

        // Read contents.
        return await fs.promises.readFile(xPath, { encoding: 'utf8' });
    }

    async create(_config, entity, _binaryContents) {
        const xPath = './contents/' + entity.original.name.systemName;

        // Currently we do nothing and return successfully,
        // this needs to be implemented!
        return {
            xdip: this.toXdip(xPath),
            systemName: entity.original.name.systemName
        };
    }
}
