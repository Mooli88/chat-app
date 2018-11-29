function DataService($q, _, $http, socketService, service) {
    var service = {},
        BASE_URL = 'http://localhost:3000';
    
    socketService.on('connect_error', function (result) {
         //TODO: Notification message
        console.error('Failed to connect: ', result)
    })

    function login() {
        return $q(function(resolve, reject) {
            socketService.on('private-welcome', function (data) {
                if (data) {
                    return resolve(data);
                }

                return reject(error);
            }) 
        })
    }

    function postMessage(options) {
        return $q(function (resolve, reject) {
            $http({
                method: 'POST',
                url: BASE_URL + '/message',
                data: {message: options.message},
                headers: {
                    "X-Message-From": options.name
                }
            })
            .then(function (result) {
                resolve(result);
            })
            .catch(function (error){
                if (error.status === 400) {
                    console.error("Empty message is not allowed")
                }

                if (error.status === 500) {
                    //TODO: Notification message / color change for the message.
                    console.error("Message couldn't be send. Please try again in few seconds.")
                }

                reject(error);
            })
        })
    }

    _.merge(service, {
        login: login,
        postMessage: postMessage,
        socket: socketService
    })

    Object.freeze(service);

    return service;
}

chatApp
    .service('chatApp.DataService', [
        "$q",
        "_",
        "$http",
        'chatApp.SocketService',
        'chatApp.Service',
        DataService
    ])