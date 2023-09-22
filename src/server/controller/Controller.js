import { validate, execute, ErrorCodes, ProtocolVersion, createErrorResponse } from "../jsonrpc/index.js";
import chalk from "chalk";

export class Controller {

    constructor(config, service) {
        this.appConfig = config;
        this.service = service;
    }

    // POST endpoint to convert any request to a JSON RPC request.
    handleRequest(req, res, next) {
        console.log(chalk.bold('Received request @') + chalk.underline(this.appConfig.path) + ' with body:');
        console.dir(req.body, { depth: null });

        this.handleJsonRpcRequest(req.body)
            .then((resValue) => {
                console.log(chalk.bold('Responding with:'));
                console.dir(resValue, { depth: null });
                res.status(200).send(resValue);
            })
            // Should not happen, just in case.
            .catch((err) => next(err));
    }

    // POST endpoint to handle any JSON RPC request.
    async handleJsonRpcRequest(body) {
        const err = validate(body);
        if (err) return err;

        const res = await execute(body, this.service);
        if (res) return res;

        return createErrorResponse(
            ProtocolVersion.V2_0,
            body.id,
            ErrorCodes.CONNECTOR_OPERATION_FAILED,
            'Controller failed to execute JSON RPC');
    }
}
