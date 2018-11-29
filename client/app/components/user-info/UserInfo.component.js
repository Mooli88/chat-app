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