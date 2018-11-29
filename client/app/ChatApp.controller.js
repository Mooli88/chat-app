function ChatAppContoller(_ , dataService, User) {
    var ctrl = this,
        _messages = [],
        _users = [],
        _user,
        ctrlProperties = {}

    ctrlProperties.messages = {
        enumerable: true,
        get: function () {
            return _messages
        }
    };

    ctrlProperties.user = {
        enumerable: true,
        get: function () {
            return _user
        }
    };

    function $onInit() {
       dataService.login()
        .then(function (result) {
            _user = new User({
                id: _.uniqueId(result + "-"),
                name: result
            })
        })
    }

    //Having the 'sendMessage' here instead of on the 'text-io' controller
    //means that 'text-io' remain more generic and flexable so it can be used for other
    //purposes as well (i.e adding item to a list).
    
    function sendMessage(textMessage) {
        var date;

        dataService.postMessage({
            name: _user.name,
            message: textMessage
        })
        .then(function (result) {
            date = new Date();

            _user.messages.push({
                message: textMessage,
                timestamp: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
            })
        })
    }

    _.merge(ctrl, {
        $onInit: $onInit,
        sendMessage: sendMessage
    })
    
    Object.defineProperties(ctrl, ctrlProperties);

    Object.seal(ctrl);
}

chatApp.controller('ChatAppContoller', [
    '_',
    'chatApp.DataService',
    'chatApp.User',
    ChatAppContoller
])