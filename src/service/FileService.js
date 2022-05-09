import AbstractService from "./AbstractService.js";

export default class FileService extends AbstractService {

    get(config, xdip) {
        // TODO: This is just a test.
        return { config, xdip };
    }

    // TODO: Implement navigating/downloading, uploading as no-op.
    // TODO: Implement some security measure.
    // TODO: Define dockerfile.
}
