function MessageViewer(_, dataService) {
    let ctrl = this,
    _messages,
    ctrlProperties = {}

function $onInit() {
    _messages = ctrl.messages;

    // Angular will try to bind any 'bindings' properties after its instantiate the controller.
    // Therefore, I seal the controller after its ready / $onInit.

    Object.seal(ctrl);

    dataService.socket.on('message', function (result) {
        //TODO: notify by sound instead
        console.info('New message from ', result);
        
        _messages.push({
            id: _.uniqueId(),
            value: result,
            isUser: _.startsWith(result, ctrl.user.name)
        })
    })
}

_.merge(ctrl, {
    $onInit: $onInit
})

Object.defineProperties(ctrl, ctrlProperties);
}

chatApp.component("messageViewer", {
    bindings: {
        messages: '<',
        user: '<'
    },
    controller: [
        '_',
        'chatApp.DataService',
        MessageViewer
    ],
    templateUrl: './components/message-viewer/message-viewer.html'
})