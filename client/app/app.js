window.chatApp = angular
    .module('chatApp', [
        'btford.socket-io'
    ])
    .constant("_", window._);
    