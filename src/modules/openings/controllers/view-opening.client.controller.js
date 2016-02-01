(function () {
  'use strict';
  angular
    .module('openings')
    .controller('ViewOpeningController', ViewOpeningController);


  /* @ngInject */
  function ViewOpeningController($state, $stateParams, _, Messages, Navigation, Opening, Position, resolvedAuth) {

    var vm = this;
    vm.user = resolvedAuth;
    vm.cancel = cancel;
    vm.createApplicationForOpening = createApplicationForOpening;
    vm.getPosition = getPosition;
    vm.openingForm = {};
    vm.options = {};

    activate();

    function cancel() {
      Opening.listOpenings();
    }

    function createApplicationForOpening() {
      $state.go('main.managerCreateApplication', {openingId: $stateParams.openingId});
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
      var controllerActions = [];
      if(vm.user.hasRole(['admin', 'manager'])) {
        actions.splice(0, 2); // for admin and director, splice out actions other than 'edit'
        //controllerActions.push({title: 'Create Application', method: vm.createApplicationForOpening, type: 'button', style: 'btn-add'});
      } else {
        actions.splice(0, actions.length); // for anyone else, splice out everything.
      }
      actions = _.union(actions, controllerActions);
      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('View Opening'); // set the page title
    }

    /**
     * setup the nav for Users without privileges.
     */
    function setupPublicNavigation() {
      Navigation.clear();
      Navigation.breadcrumbs.add('Openings', '#!/openings', '#!/openings'); // add a breadcrumb
      Navigation.viewTitle.set('View Opening');
    }

    function activate() {

      // if the User does not have privileges
      if(!vm.user._id || !vm.user.hasRole(['admin', 'committee member'])) {
        Opening.getForPublic({
          openingId: $stateParams.openingId
        }).$promise
          .then(function (result) {
            vm.opening = result;
          })
          .catch(function (err) {
            Messages.addMessage(err.data.message, 'error');
          });
        setupPublicNavigation();
        return 'done';
      }

      Opening.get({
        openingId: $stateParams.openingId
      }).$promise
        .then(function(result) {
          vm.opening = result;
        })
        .catch(function(err) {
          Messages.addMessage(err.data.message, 'error', null, 'dev');
        });
      //setupNavigation();
      //getValueLists();
    }
  }
})();
