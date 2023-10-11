import AbstractService from "./AbstractService.js";

import fs from "node:fs";
import path from "node:path";
import FolderEntity from "./model/FolderEntity.js";
import FileEntity from "./model/FileEntity.js";
import mime from "mime-types";
import OperationNotAllowedError from "../server/errors/OperationNotAllowedError.js";
import NoSuchEntityError from "../server/errors/NoSuchEntityError.js";
import NoBinaryContentError from "../server/errors/NoBinaryContentError.js";

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
            throw new NoSuchEntityError(xdip);
        }

        return stat.isDirectory()
            ? this.createFolderFromStat(xdip, stat)
            : this.createFileFromStat(xdip, stat);
    }

    createFolderFromStat(xdip, stat) {
        const xPath = this.fromXdip(xdip);
        const systemName = path.basename(xPath);
        const parentXdip =  path.dirname(xdip ?? '');

        const entity = new FolderEntity(xdip, systemName, parentXdip);
        entity.created = stat.birthtime;
        entity.modified = stat.mtime;

        return entity;
    }

    createFileFromStat(xdip, stat) {
        const xPath = this.fromXdip(xdip);
        const systemName = path.basename(xPath);
        const parentXdip =  path.dirname(xdip ?? '');

        const entity = new FileEntity(xdip, systemName, parentXdip);
        entity.created = stat.birthtime;
        entity.modified = stat.mtime;
        entity.rawExtension = path.extname(systemName ?? '').substring(1);
        entity.mimeType = mime.lookup(systemName) || 'application/octet-stream';
        entity.size = stat.size;
        entity.language = 'en-US';

        return entity;
    }

    async getChildren(_config, xdip) {
        const xPath = this.fromXdip(xdip);

        // Check if it exists.
        let stat;
        try {
            stat = await fs.promises.lstat(xPath);
        } catch (_err) {
            throw new NoSuchEntityError(xdip);
        }

        if (!stat.isDirectory()) {
            throw new OperationNotAllowedError('Listing children is supported only for folders.');
        }

        // Output all child data.
        const children = await fs.promises.readdir(xPath);
        return Promise.all(children.map(async (child) => {
            const xdipChild = this.childXdip(xdip, child);
            const pathChild = this.fromXdip(xdipChild);
            const statChild = await fs.promises.lstat(pathChild);

            return statChild.isDirectory()
                ? this.createFolderFromStat(xdipChild, statChild)
                : this.createFileFromStat(xdipChild, statChild);
        }));
    }

    async getBinary(_config, xdip) {
        const xPath = this.fromXdip(xdip);

        // Check if it exists & if it is a file.
        let stat;
        try {
            stat = await fs.promises.lstat(xPath);
        } catch (_err) {
            throw new NoSuchEntityError(xdip);
        }

        if (!stat.isFile())
            throw new NoBinaryContentError(xdip);

        // Read contents.
        return await fs.promises.readFile(xPath, { encoding: 'utf8' });
    }

    async create(_config, entity, _binaryContents) {
        const xPath = './contents/' + entity.original.name.systemName;

        // Currently we do nothing and return successfully,
        // this needs to be implemented!
        return new FileEntity(
            entity.original.language.translationOf,
            entity.original.name.systemName,
            entity.original.language.translationOf
        );
    }
}
