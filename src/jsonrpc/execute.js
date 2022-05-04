import { Method, ProtocolVersion, createSuccessResponse } from "./index.js";

export function execute(body) {
    switch (body.method) {
        case Method.ENTITY_GET:
            return createSuccessResponse(
                ProtocolVersion.V2_0,
                body.id,
                'entity.get successful-ish');

        // TODO: Implement all methods correctly obviously.
    }
}
