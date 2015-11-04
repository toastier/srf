(function () {
  'use strict';
  angular
    .module('eoe')
    .controller('ListEoeController', ListEoeController);

  function ListEoeController($scope, $state, Navigation, Eoe, Messages, resolvedAuth, _) {
    var vm = this;
    vm.noFilteringDirective = true;
    vm.user = resolvedAuth;
    vm.allowEdit = allowEdit;
    vm.allowView = allowView;
    vm.isActiveYes = true;
    vm.isActiveNo = false;
    vm.setIsActive = setIsActive;
    vm.raceCount = raceCount;
    vm.options = { };

    function allowView () {
      return true;
    }


    function allowEdit () {
      return vm.user.hasRole(['admin']);
    }

    function raceCount(code, eoeData) {
      return _.filter(eoeData, function(data) {
        return (data.race[code] === true)
      }).length;
    }

    function setIsActive (source) {
      if (source === 'isActiveYes') {
        if (vm.isActiveYes) {
          vm.isActiveNo = false;
          vm.collection.filterCriteria.isActive = true;
        } else {
          vm.collection.filterCriteria.isActive = null;
        }
      } else {
        if (vm.isActiveNo) {
          vm.isActiveYes = false;
          vm.collection.filterCriteria.isActive = false;
        } else {
          vm.collection.filterCriteria.isActive = null;
        }
      }
      vm.collection.filterCollection();
    }


    vm.options.races = [{
      code: 'native',
      description: 'American Indian or Alaskan Native',
      detail: 'Having origins in any of the original peoples of North and South America (including Central America), and who maintain tribal affiliation or community attachment'
      },
      {
        code: 'asian',
        description: 'Asian',
        detail: 'Having origins in any of the original peoples of the Far East, Southeast Asia, or the Indian Subcontinent, including, for example, Cambodia, China, India, Japan, Korea, Malaysia, Pakistan, the Philippine Islands, Thailand, and Vietnam'
      },
      { code: 'black', description: 'Black or African American', detail: 'Having origins in any of the black racial groups of Africa' },
      { code: 'pacific', description: 'Native Hawaiian or Other Pacific Islander', detail: 'Having origins in any of the peoples of Hawaii, Guam, Samoa, or other Pacific Islands' },
      { code: 'white', description: 'White', detail:'A person having origins in any of the original peoples of Europe, the Middle East, or North Africa' },
      { code: 'other', description: 'Other' },
      { code: 'declined', description: 'Declined'}
    ];

    vm.options.genders = [
      { code: 'm', description: 'Male' },
      { code: 'f', description: 'Female' },
      { code: 'd', description: 'Declined' }
    ];

    vm.options.ethnicities = [
      {
      code: 'h',
      description: 'Hispanic or Latino',
      detail: 'Of Cuban, Mexican, Puerto Rican, South or Central American, or other Spanish culture or origin regardless of race.'
    },
      {
        code: 'n',
        description: 'Not Hispanic or Latino'
      },
      {
        code: 'd',
        description: 'Declined to Answer'
      }
    ];
    vm.options.disabilities = [
        {
        code: 'y',
        description: 'Yes'
      },
        {
          code: 'n',
          description: 'No'
        },
        {
          code: 'd',
          description: 'Declined to Answer'
        }
      ];



    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation

      var actions = Eoe.getActions(); // get the actions from the Model
      actions.splice(1, 2); // splice out the ones we don't want (were taking them all out here)

      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('EOE Data - Demographics'); // set the page title
    }

    function activate () {
      $scope._ = _;

      Eoe.query()
          .$promise
          .then(function(result) {
                var demographicData = (_.find(result, function(data) {
                  return data.type = "demographic";
                })).data;
                vm.eoeData = { byGender: {}, byEthnicity: {}, byRace: { 'multiple': 0, 'declined' : 0} };
                 _.forEach(vm.options.genders, function(gender) {
                   var genderCount=_.size(_.filter(demographicData, function(rec) {
                     return rec.gender === gender.code;
                   }));
                   console.log(gender.description + ' count is ' + genderCount);
                   vm.eoeData.byGender[gender.code] = { "count": genderCount, "label" : gender.description};
                 });
                _.forEach(vm.options.ethnicities, function(ethnicity) {
                  var ethnicityCount=_.size(_.filter(demographicData, function(rec) {
                    return rec.ethnicity === ethnicity.code;
                  }));
                  console.log(ethnicity.description + ' count is ' + ethnicityCount);
                  vm.eoeData.byEthnicity[ethnicity.code] = {"count" : ethnicityCount, "label" : ethnicity.description};
                });
                _.forEach(vm.options.races, function(race) {
                  var raceCount=_.size(_.filter(demographicData, function(rec) {
                    return rec.race[race.code] === true;
                  }));
                  console.log(race.description + ' count is ' + raceCount);
                  vm.eoeData.byRace[race.code] = { "count" : raceCount, "label" : race.description };
                });
                vm.eoeData.byRace.multiple = _.size(_.filter(demographicData, function(rec) {
                    return _.size(_.keys(_.pick(rec.race, _.identity))) > 1;
                  }));
            //new CollectionModel('EoeController', result, vm.columnDefinitions, initialSortOrder)
            //    .then(function(collection) {
            //      vm.collection = collection;
            //
            //      // watch for change when filters are cleared, and set UI variables/controls appropriately
            //      $scope.$watch('vm.collection.filterCriteria.isActive', function(newValue) {
            //        switch (newValue) {
            //          case true:
            //            vm.isActiveYes = true;
            //            vm.isActiveNo = false;
            //            break;
            //          case false:
            //            vm.isActiveNo = true;
            //            vm.isActiveYes = false;
            //            break;
            //          default:
            //            vm.isActiveYes = null;
            //            vm.isActiveNo = null;
            //        }
            //      });
            //    })
            //    .catch(function(err) {
            //      Messages.addMessage(err.data.message, 'error');
            //    });

          });
      setupNavigation();
    }
    function viewEoe (Eoe) {
      $state.go('main.viewEoe', { EoeId: Eoe._id });
    }

    activate();

  }
})();
