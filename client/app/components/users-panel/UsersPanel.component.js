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