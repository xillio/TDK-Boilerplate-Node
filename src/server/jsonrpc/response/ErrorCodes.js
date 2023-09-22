
export const ErrorCodes = {
    AUTHORIZATION_FAILED: 0,
    CONNECTOR_OPERATION_FAILED: 10,
    ENTITY_ALREADY_EXISTS: 20,
    HOST_NOT_REACHED: 30,
    INSUFFICIENT_STORAGE: 40,
    INVALID_QUERY: 50,
    MISCONFIGURED_SYSTEM: 60,
    MISSING_DECORATOR: 70,
    NO_BINARY_CONTENT: 80,
    NO_SUCH_ENTITY: 90,
    NO_SUCH_HANDLER: 100,
    NO_SUCH_SCOPE: 110,
    OPERATION_NOT_ALLOWED: 120,
    QUOTA_EXCEEDED: 130,
    UNSUPPORTED_CONTENT_TYPE: 140,
    INVALID_CONFIGURATION: 150
};

export const ErrorMessages = {
    [ErrorCodes.AUTHORIZATION_FAILED]: 'Authorization Failed',
    [ErrorCodes.CONNECTOR_OPERATION_FAILED]: 'Connector Operation Failed',
    [ErrorCodes.ENTITY_ALREADY_EXISTS]: 'Entity Already Exists',
    [ErrorCodes.HOST_NOT_REACHED]: 'Host Not Reached',
    [ErrorCodes.INSUFFICIENT_STORAGE]: 'Insufficient Storage',
    [ErrorCodes.INVALID_QUERY]: 'Invalid Query',
    [ErrorCodes.MISCONFIGURED_SYSTEM]: 'Misconfigured System',
    [ErrorCodes.MISSING_DECORATOR]: 'Missing Decorator',
    [ErrorCodes.NO_BINARY_CONTENT]: 'No Binary Content',
    [ErrorCodes.NO_SUCH_ENTITY]: 'No Such Entity',
    [ErrorCodes.NO_SUCH_HANDLER]: 'No Such Handler',
    [ErrorCodes.NO_SUCH_SCOPE]: 'No Such Scope',
    [ErrorCodes.OPERATION_NOT_ALLOWED]: 'Operation Not Allowed',
    [ErrorCodes.QUOTA_EXCEEDED]: 'Quota Exceeded',
    [ErrorCodes.UNSUPPORTED_CONTENT_TYPE]: 'Unsupported Content Type',
    [ErrorCodes.INVALID_CONFIGURATION]: 'Invalid Configuration'
};
