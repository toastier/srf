(function () {
  'use strict';
  angular
    .module('openings')
    .controller('ViewOpeningController', ViewOpeningController);


  /* @ngInject */
  function ViewOpeningController($stateParams, Messages, Navigation, Opening, Position, resolvedAuth) {

    var vm = this;
    vm.user = resolvedAuth;
    vm.cancel = cancel;
    vm.getPosition = getPosition;
    vm.openingForm = {};
    vm.options = {};

    activate();

    function cancel() {
      Opening.listOpenings();
    }

    function getPosition(positionId) {
      var matched = false;
      angular.forEach(vm.options.positions, function(position) {
        if (!matched && positionId === position._id) {
          matched = position;
        }
      });
      if(matched && matched.name) {
        return matched.name;
      }
      return 'No Match';
    }

    function getValueLists() {
      Position.query().$promise
        .then(function(result) {
          vm.options.positions = result;
        })
        .catch(function(error) {
          Messages.addMessage(error.data.message, 'error');
        });
    }

    function setupNavigation () {
      Navigation.clear(); // clear everything in the Navigation
      Navigation.breadcrumbs.add('Openings', '#!/openings', '#!/openings'); // add a breadcrumb
      var actions = Opening.getActions(); // get the actions from the Model
      if(vm.user.hasRole(['admin'])) {
        actions.splice(0, 2); // for admin and director, splice out actions other than 'edit'
      } else {
        actions.splice(0, actions.length); // for anyone else, splice out everything.
      }
      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('View Opening'); // set the page title
    }

    function activate() {

      Opening.get({
        openingId: $stateParams.openingId
      }).$promise
        .then(function(result) {
          vm.opening = result;
        })
        .catch(function(err) {
          Messages.addMessage(err.data.message, 'error', null, 'dev');
        });
      setupNavigation();
      getValueLists();
    }
  }
})();
