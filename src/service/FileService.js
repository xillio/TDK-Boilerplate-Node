import ContentService from "./ContentService.js";
import { ProtocolVersion, createSuccessResponse } from "../jsonrpc/index.js";

export default class FileService extends ContentService {

    get(id, params) {
        return createSuccessResponse(
            ProtocolVersion.V2_0,
            id,
            'Test success: ' + params.xdip);
    }
}
