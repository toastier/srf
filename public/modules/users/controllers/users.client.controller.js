(function () {
  'use strict';
  angular
    .module('users')
    .controller('UsersController', UsersController);

  function UsersController($scope, $state, Users, Roles, resolvedAuth, Navigation, Masquerade, Pagination, Sorting, Filtering, Messages) {
    var vm = this;
    vm.authentication = resolvedAuth;
    vm.paginator = Pagination.paginator;
    vm.users = {original: [], matched: [], paginated: []};
    vm.options = {};
    vm.forms = {};
    vm.newUser = {};
    vm.forms.userCreate = undefined;
    vm.forms.userForms = {};
    vm.saveUser = saveUser;
    vm.createUser = createUser;
    vm.undoUser = undoUser;
    vm.masquerade = masquerade;
    vm.paginate = paginate;
    vm.filterCollection = filterCollection;
    vm.clearFilters = clearFilters;
    vm.sortBy = sortBy;
    vm.sortingClass = sortingClass;
    vm.tableColumns = [
      {field: 'displayName', label: 'Name', sortable: true, filterable: true},
      {field: 'username', label: 'Name', sortable: true, filterable: true}
    ];

    var filterDefinitionArray = [];

    function sortingClass(predicate) {
      return Sorting.sortingClass(predicate);
    }

    function paginate() {
      vm.users.paginated = Sorting.sortThenPaginate(vm.users.matched, vm.users.paginated);
    }

    function sortBy(predicate) {
      Sorting.prependToSortOrder(predicate);
      paginate();
    }

    function filterCollection() {
      vm.users.matched = vm.filtering.doFiltering();
      paginate();
    }

    function setupFilters() {
      filterDefinitionArray = vm.filtering.buildFilterConfigurationArray(vm.tableColumns);
      vm.filtering.addFilterDefinitions(filterDefinitionArray);
    }

    function clearFilters() {
      vm.filtering.clearFilters();
      filterCollection();
    }

    /**
     * Finds a User in the collection based on _id
     * @param id
     * @param collection
     * @returns {boolean}
     */
    function findUserById(id, collection) {
      collection = collection || vm.users.original;
      var matched = false;
      angular.forEach(collection, function (user) {
        if (!matched && user._id === id) {
          matched = user;
        }
      });
      return matched;
    }

    /**
     * Return the index of the User in the collection based on _id
     * @param id
     * @param collection
     * @returns {number}
     */
    function findIndexOfUserById(id, collection) {
      collection = collection || vm.users.original;
      var matched = false;
      var index = -1;
      angular.forEach(collection, function (user) {
        if (!matched && user._id === id) {
          matched = true;
          index = collection.indexOf(user);
        }
      });
      return index;
    }

    function saveUser(user, userForm) {
      user.$update()
        .then(function (result) {
          userForm.$setPristine();
          var index = findIndexOfUserById(user._id);
          vm.users.original[index] = result;
          Messages.addMessage('The User ' + result.displayName + ' was updated.', 'success');
          user.isCollapsed = false;
          filterCollection();
        });
    }

    function createUser() {
      Users.save(vm.newUser).$promise.then(function (user) {
        if (user._id) {
          Messages.addMessage('The User ' + user.displayName + ' was added.', 'info');
          $state.go('list');
        }
      });
    }

    /**
     * Undo changes to the User
     * @param user
     * @param userForm
     */
    function undoUser(user, userForm) {
      var backupUser = findUserById(user._id);
      backupUser.isCollapsed = false;
      var index = findIndexOfUserById(user._id);
      vm.users.original[index] = angular.copy(backupUser);
      filterCollection();
      userForm.$setPristine();
    }

    function masquerade(user) {
      Masquerade.do(user).$promise.then(function () {
        vm.authentication.refresh();
        $state.go('main.home');
      });
    }

    function setupData() {
      Users.query().$promise
        .then(function (result) {
          Messages.addMessage('Users loaded', 'success');
          angular.forEach(result, function (user) {
            user.isCollapsed = true;
          });
          vm.users.original = result;
          vm.users.matched = angular.copy(vm.users.original);
          vm.filtering = new Filtering(vm.users.original, vm.users.matched);
          Sorting.setSortOrder([
            '+lastName'
          ]);
          vm.users.paginated = Sorting.sortThenPaginate(vm.users.matched, vm.users.paginated);
          setupFilters();
        })
        .catch(function (err) {
          Messages.addMessage(err, 'error', 'Error Loading Users');
        });
      Roles.query().$promise
        .then(function (result) {
          vm.roles = result;
        })
        .catch(function (err) {
          Messages.addMessage(err, 'error', 'Error Loading Roles');
        });

    }

    /**
     * Performs setup and data retrieval
     * @param mode string
     */
    function activate() {

      Navigation.clear();
      Navigation.breadcrumbs.add('Dashboard', '#!/dashboard', '/#!/dashboard');
      Navigation.viewTitle.set('Users');
      setupData();
    }

    activate();

    $scope.$watch('vm.paginator.itemsPerPage', function () {
      paginate();
    });
  }
})();
