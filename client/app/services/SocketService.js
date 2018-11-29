function SocketService(socketService) {
    return socketService({
        ioSocket: io.connect("http://localhost:3000", {
            path: '/ws'
        })
    });
}

chatApp
    .service('chatApp.SocketService', [
        'socketFactory',
        SocketService
    ])