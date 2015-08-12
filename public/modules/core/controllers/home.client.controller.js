'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Messages', 'toastr', function ($scope, Authentication, Messages, toastr) {
  var home = this;

  home.authentication = Authentication;

  function activate() {
    var messages = Messages.getMessages();
    Messages.clearMessages();

    angular.forEach(messages, function(message) {
      if(message.type === 'warn') {
        toastr.warning(message.message);
      } else {
        toastr.info(message.message);
      }
    });
  }

  activate();


}]);