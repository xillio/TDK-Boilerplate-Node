# TDK-Boilerplate-Node

This project contains boilerplate to quickly setup a server to use the JSON RPC connector of the Xillio API.

You can read more regarding this connector in the [Xillio API documentation](https://docs.xill.io/#connector-json-rpc).

This TDK is also available in [C#](https://github.com/xillio/TDK-Boilerplate-CSharp)
and [Java](https://github.com/xillio/TDK-Boilerplate-Java).

## Supported operations

The TDK supports the following operations:
- Navigating the repository (getting entities)
- Downloading content
- Uploading translations

## How to use

To implement your own connector, simply add another service in `src/service/` that extends `src/service/AbstractService.js`. An example can be found in `src/service/FileService.js`.

The service needs to implement the following functions:
- `validate`
- `authorize`
- `get`
- `getChildren`
- `getBinary`
- `create`

To use the newly created service, or adjust other settings such as the exposed port or path to the endpoint, see `src/server.js`. A configuration object is passed to the application. This can be freely modified. The `service` property defines what file in `src/service/` to use as active service.
