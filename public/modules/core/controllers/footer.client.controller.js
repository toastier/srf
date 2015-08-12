'use strict';

angular.module('core').controller('FooterController', ['Authentication',
    function(Authentication) {
        var footer = this;
        footer.authentication = Authentication;
    }
]);
