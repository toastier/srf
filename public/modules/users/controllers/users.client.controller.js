'use strict';

function UsersController($scope, $state, toastr, Users, Roles, Authentication, Masquerade, Matching, Sorting, Pagination) {

  var vm = this;
  vm.options = {};
  vm.forms = {};
  vm.newUser = {};
  vm.forms.userCreate = undefined;
  vm.forms.userForms = {};
  // expose the authentication object to the view
  vm.authentication = Authentication;
  vm.paginator = Pagination.paginator;
  vm.users = [];
  vm.matchedUsers = [];
  vm.paginatedUsers = [];

  function createShadowData() {
    vm.usersOriginal = angular.copy(vm.users);
  }

  /**
   * Finds a User in the collection based on _id
   * @param id
   * @param collection
   * @returns {boolean}
   */
  function findUserById(id, collection) {
    collection = collection || vm.users;
    var matched = false;
    angular.forEach(collection, function(user) {
      if(!matched && user._id === id) {
        matched = user;
      }
    });
    return matched;
  }

  /**
   * Performs setup and data retrieval
   * @param mode string
   */
  function activate (mode) {
    switch (mode) {
      case 'create':
        //do something
        break;
      default:
        Users.query().$promise.then(function(result) {
          vm.users = result;
          angular.forEach(vm.users, function(user) {
            vm.forms.userForms[user._id] = 'user-' + user._id;
            user.isCollapsed = true;
          });
          createShadowData();
          vm.matchedUsers = angular.copy(vm.users);
          Sorting.setSortOrder([
            '+lastName'
          ]);
          vm.paginatedUsers = Sorting.sortThenPaginate(vm.matchedUsers, vm.paginatedUsers);
        });
    }
  }

  vm.activate = activate;

  vm.options.roles = Roles.query();

  vm.saveUser = function(user) {
    user.$update().then(function(result) {
      vm.forms.userForms[user._id].$setPristine();
      toastr.info('The User ' + result.displayName + ' was updated.');
      createShadowData();
    });
  };

  vm.createUser = function() {
    Users.save(vm.newUser).$promise.then(function(user) {
      if(user._id) {
        toastr.info('The User ' + user.displayName + ' was added.');
        $state.go('list');
      }
    });
  };

  /**
   * Undo changes to the User
   * @param user
   */
  vm.undoUser = function(user) {
    var backupUser = findUserById(user._id, vm.usersOriginal);
    var index = vm.users.indexOf(user);
    vm.users[index] = angular.copy(backupUser);
    vm.users[index].isCollapsed = false;
  };

  vm.masquerade = function(user) {
    Masquerade.do(user).$promise.then(function(response) {
      vm.authentication.refresh();
      $state.go('home');
    });
  };

  $scope.$watch('vm.paginator.currentPage', function() {
    vm.paginatedUsers = Pagination.paginate(vm.matchedUsers);
  });
}

angular
  .module('users')
  .controller('UsersController', UsersController);
