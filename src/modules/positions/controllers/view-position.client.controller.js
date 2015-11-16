(function () {
  'use strict';
  angular
    .module('positions')
    .controller('ViewPositionController', ViewPositionController);

  /* @ngInject */
  function ViewPositionController($stateParams, Position, Navigation, resolvedAuth, Messages, _) {
    /* jshint validthis: true */
    var vm = this;
    vm.user = resolvedAuth;

    function activate() {
      Position.get({
        positionId: $stateParams.positionId
      }).$promise
        .then(function(result) {
          vm.position = result;
        })
        .catch(function(err) {
          Messages.addMessage(err.data.message, 'error', null, 'dev');
        });
      setupNavigation();
    }

    activate();

    function setupNavigation () {
      Navigation.clear(); // clear everything in the Navigation
      Navigation.breadcrumbs.add('Positions', '#!/positions', '#!/positions'); // add a breadcrumb
      var actions = Position.getActions(); // get the actions from the Model
      actions.splice(0, 2); // splice out the ones we don't want (were taking them all out here)
      if (vm.user.hasRole(['admin'])) {
        Navigation.actions.addMany(actions); // add the actions to the Navigation service
      }
      Navigation.viewTitle.set('View Position'); // set the page title
    }
  }
})();
