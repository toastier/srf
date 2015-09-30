(function () {
  'use strict';
  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  function HeaderController($scope, Authentication, Menus, Messages, toastr, appInfo) {
    var header = this;
    //@todo add switch for production mode to suppress dev messages
    var environment = 'dev';
    header.menu = Menus.getMenu('topbar');
    header.sidebarMenu = Menus.getMenu('sidebar');
    header.user = Authentication;
    header.messages = Messages.messages;
    header.isCollapsed = true;

    header.toggleCollapsibleMenu = function () {
      header.isCollapsed = !header.isCollapsed;
    };
    header.appInfo = appInfo.init();

    function showMessages() {

      function removeMessage(message) {
        header.messages.splice(header.messages.indexOf(message), 1);
      }

      angular.forEach(header.messages, function (message) {
        if (environment === 'dev' || environment === message.env) {
          switch (message.type) {
            case 'warning':
              toastr.warning(message.message, message.title, message.overrideOptions);
              break;
            case 'success':
              toastr.success(message.message, message.title, message.overrideOptions);
              break;
            case 'error':
              toastr.error(message.message, message.title, message.overrideOptions);
              break;
            default:
              toastr.info(message.message, message.title, message.overrideOptions);
          }
          removeMessage(message);
        }
      });
    }

    $scope.$watch('header.messages', function () {
      showMessages();
    }, true);
  }

})();
