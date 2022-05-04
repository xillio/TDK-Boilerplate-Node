import { ContentService } from "./index.js";
import { ProtocolVersion, createSuccessResponse } from "../jsonrpc/index.js";

export class FileService extends ContentService {

    get(id, params) {
        return createSuccessResponse(
            ProtocolVersion.V2_0,
            id,
            'Test success: ' + params.xdip);
    }
}
