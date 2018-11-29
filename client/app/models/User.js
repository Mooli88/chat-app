
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
