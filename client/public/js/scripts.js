(function(chatApp){
	"use strict";

	window.chatApp = angular
    .module('chatApp', [
        'btford.socket-io'
    ])
    .constant("_", window._);
    
})(window.chatApp);

(function(chatApp){
	"use strict";

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
})(window.chatApp);

(function(chatApp){
	"use strict";

	
function UserFactory(_) {
    var _DEFAULT_PROFILE_IMAGE_URL = "/assets/users/profle_default.png";

    function User(values) {
        var user = this,
            _id,
            _messages,
            _name,
            _profileImageUrl,
            _themeColor,
            userProperties = {};

        values = _.isPlainObject(values) && values || {};

        _id = _.isString(values.id) && values.id.toLowerCase() || _.uniqueId(result + "-").toLowerCase();

        _messages = _.isArray(values.messages) && values.messages || [];

        _name = _.isString(values.name) && values.name || "Private";

        _profileImageUrl = _.isString(values.profileImageUrl) && values.profileImageUrl;

        _themeColor = _.isString(values.themeColor) && values.themeColor || "#5ce98c";

        userProperties.messages = {
            enumerable: true,
            get: function () {
                return _messages;
            }
        };

        userProperties.id = {
            enumerable: true,
            get: function () {
                return _id;
            }
        };

        userProperties.name = {
            enumerable: true,
            get: function () {
                return _name;
            },
            set: function (value) {
                _name = value;
            }
        };

        userProperties.profileImageUrl = {
            enumerable: true,
            get: function () {
                return _profileImageUrl;
            },
            set: function (value) {
                setImage(value);
            }
        };

        userProperties.themeColor = {
            enumerable: true,
            get: function () {
                return _themeColor;
            },
            set: function (value) {
                _themeColor = value;
            }
        };

        function setImage(src) {
            if (!_.isString(src)) {
                _profileImageUrl = _DEFAULT_PROFILE_IMAGE_URL;

                return;
            }
            
            var img = new Image(0, 0)

            img.src = src
            
            img.onload = function () {
                _profileImageUrl = src;
            }
            
            reimg.onerror = function () {
                _profileImageUrl = _DEFAULT_PROFILE_IMAGE_URL;
            }

            img.load = function () {
                img = null;                
            }
        }

        setImage(_profileImageUrl);

        Object.defineProperties(user, userProperties);

        Object.seal(user);
    }

    return User;
}

chatApp
    .factory("chatApp.User", [
        "_",
        UserFactory
    ]);

})(window.chatApp);

(function(chatApp){
	"use strict";

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
})(window.chatApp);

(function(chatApp){
	"use strict";

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
})(window.chatApp);

(function(chatApp){
	"use strict";

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
})(window.chatApp);

(function(chatApp){
	"use strict";

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
})(window.chatApp);

(function(chatApp){
	"use strict";

	function TextIoController(_) {
    let ctrl = this,
        _text = '',
        ctrlProperties = {}
        
    ctrlProperties.text = {
        enumerable: true,
        get: function () {
            return _text; 
        },
        set: function (value) {
            _text = value;
        }
    };

    ctrlProperties.isValid = {
        enumerable: true,
        get: function () {
            return !_.isEmpty(_text); 
        }
    };

    //TODO: Add emojis.

    function $onInit() {

        // Angular will try to bind any 'bindings' properties after its instantiate the controller.
        // Therefore, I seal the controller after its ready / $onInit.

        Object.seal(ctrl);
    }

    function submit() {
        ctrl.send({
            textMessage: _text
        })

        _text = "";
    }

    function submitMessageKeyUp(event) {
        if (!isValid) {
            return;
        }
        
        //Send message if user press enter;
        if (event.keyCode === 13) {
            sendMessage();
        }
    }

    _.merge(ctrl, {
        $onInit: $onInit,
        submit: submit
    })

    Object.defineProperties(ctrl, ctrlProperties);
}

chatApp
    .component("textIo", {
        bindings: {
            send: '&'
        },
        controller: [
            '_',
            TextIoController
        ],
        templateUrl: './components/text-io/text-io.html'
    })
})(window.chatApp);

(function(chatApp){
	"use strict";

	function UserInfoController(_) {
    let ctrl = this,
        ctrlProperties = {}

    //TODO: Add color picker.

    function $onInit() {
        // Angular will try to bind any 'bindings' properties after its instantiate the controller.
        // Therefore, I seal the controller after its ready / $onInit.

        Object.seal(ctrl);
    }

    _.merge(ctrl, {
        $onInit: $onInit
    })

    Object.defineProperties(ctrl, ctrlProperties);
}

chatApp
    .component("userInfo", {
        bindings: {
            user: '<'
        },
        controller: [
            '_',
            UserInfoController
        ],
        templateUrl: './components/user-info/user-info.html'
    })
})(window.chatApp);

(function(chatApp){
	"use strict";

	function UsersPanel(_, dataService, User) {
    var ctrl = this,
        _user,
        _users = [],
        ctrlProperties = {};

    ctrlProperties.users = {
        enumerable: true,
        get: function () {
            return _users
        }
    };

    function $onInit() {
        _user = ctrl.user;
        // Angular will try to bind any 'bindings' properties after its instantiate the controller.
        // Therefore, I seal the controller after its ready / $onInit.

        Object.seal(ctrl);

        dataService.socket.on('members', function (result) {
            var users = _.isArray(result) && result || []

            updateUsers(users)
        })
    }

    function updateUsers(users) {
        var userDetails

        //Exclude self / `_user`
        _.remove(users, function (value) {
            return value === _user.name;
        });

        //Updating the `_users` list
        _users = _.map(users, function (user) {
            return new User({
                id: _.uniqueId(user + "-"),
                name: user
            });
        });

        //Normaly I wouldn't completly overwrite the list but try to update it.
        //In this case I will have to loop on both `users` and `_users` in order 
        //to update `_users` correctly. This would be a bit much and instead the server
        //should supply more information on the users.
    }

    _.merge(ctrl, {
        $onInit: $onInit
    });

    Object.defineProperties(ctrl, ctrlProperties);
}

chatApp
    .component("usersPanel", {
        bindings: {
            user: '<'
        },
        controller: [
            "_",
            'chatApp.DataService',
            'chatApp.User',
            UsersPanel
        ],
        templateUrl: './components/users-panel/users-panel.html'
    })
})(window.chatApp);
