# LocHub TDK Boilerplate project for Node.JS

[LocHub](https://lochub.com) is a translation middleware platform by [Xillio](https://xillio.com) connecting content owners and the translation providers as seamlessly as possible.

The platform comes with a content framework built by Xillio. After initial definition of a connection to a content repository, user can navigate the repository with a content browser and pickup content for translation manually or automate the selection based on metadata.

Translation Development Kit (aka TDK) is a way how to integrate any content into this content framework and use all the described features with the content. To integrate your content repository you can choose your favorite technology, and build a web service capable of

* delivering the metadata of your content
* navigating your content repository
* downloading binary content
* uploading translations

Your web service will expose an endpoint and the framework will send requests to this endpoint with JSON payload to specify the operation to perform and its parameters. The web service will respond with a JSON response describing the metadata of the content, deliver the binary content or simply confirm the translation creation.

This repository contains a boilerplate project of such a web service build with Node.JS.

Similar boilerplate projects are available also for [C#](https://github.com/xillio/TDK-Boilerplate-CSharp)
and [Java](https://github.com/xillio/TDK-Boilerplate-Java)

## How to use TDK?

We recommend reading our TDK Documentation first. You will learn the overall design and how to build a custom connector from scratch.

But using the boilerplate project like this is much easier. You need to implement only the communication with your repository and optionally also validation of your custom configuration and the boilerplate takes care about the rest (error handling, parsing the JSON RPC requests, building the JSON RPC responses, etc.)

To implement your own connector, 
- in `src/connector/` implement new service that extends `src/connector/AbstractService.js` (an example can be found in `FileService.js`),
- in `src/server/server.js` reference the new service and set the port of the server and the route to expose.

The service needs to implement the following functions:
- `validate`
- `authorize`
- `get`
- `getChildren`
- `getBinary`
- `create`

As a simple test, the server can be started as follows:
```
npm install && npm start
```
The application currently only runs under HTTP. Implementing HTTPS could be achieved in several ways, either implement it in the codebase yourself or set up a proxy.

## Building a Docker image

To build a docker image, run:
```
docker build -t <image_name> .
```

To run the image (`<configured port>` being the port set in `src/server.js`):
```
docker run -p 8080:<configured_port> -v <host_path>:/contents <image_name>
```

The built container will expose port 8080 by default, this can be changed in `Dockerfile`. The `-v` option can be given to mount a host directory to the `/contents` folder in the container. This folder is used by the default `FileService` as repository. If running from the root of this git repository:
```
docker run -p 8080:8080 -v $(pwd)/contents:/contents <image_name>
```
