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