function ChatAppService(_) {
    var service = {},
        _users,
        _user,
        serviceProperties = {}

    serviceProperties.user = {
        enumerable: true,
        get: function () {
            return _user
        }
    };

    serviceProperties.users = {
        enumerable: true,
        get: function () {
            return _users
        }
    };

    Object.defineProperties(service, serviceProperties);

    Object.seal(service);

    return service;

}

chatApp
    .service('chatApp.Service', [
        "_",
        ChatAppService
    ])