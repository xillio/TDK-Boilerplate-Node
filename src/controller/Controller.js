import { validateRequestBody } from "../service/index.js";

export class Controller {

    // POST endpoint to handle any JSON RPC request.
    handleJsonRpcRequest(req, res, next) {
        validateRequestBody(req.body);
        res.send({});
        next();
    }
}
