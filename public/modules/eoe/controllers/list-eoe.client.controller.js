(function () {
  'use strict';
  angular
    .module('eoe')
    .controller('ListEoeController', ListEoeController);

  function ListEoeController($scope, $state, Navigation, Eoe, Messages, Opening, resolvedAuth, _) {
    var vm = this;
    vm.noFilteringDirective = true;
    vm.user = resolvedAuth;
    vm.allowEdit = allowEdit;
    vm.allowView = allowView;
    vm.isActiveYes = true;
    vm.isActiveNo = false;
    vm.setIsActive = setIsActive;
    vm.raceCount = raceCount;
    vm.extractData = extractData;
    vm.rawData = [];
    vm.opening = "all";
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

    function extractData() {
      parseDemographic(vm.rawData, vm.opening);
      parseDisability(vm.rawData);
      parseVeteran(vm.rawData);
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

    vm.options.veterans = [
      {
        code: 'yes-id',
        description: 'Yes, identify as veteran'
      },
      {
        code: 'yes-not-id',
        description: 'Yes, but do not identify'
      },
      {
        code: 'no',
        description: 'No'
      },
      {
        code: 'declined',
        description: 'Declined to Answer'
      }
    ];

    vm.options.vetClasses = [
      { code: 'disabled', description: 'Disabled Veteran' },
      { code: 'recent', description: 'Recently Separated Veteran', detail: 'Discharged or released from active duty within 36 months' },
      { code: 'active', description: 'Active Duty Wartime or Campaign Badge Veteran', detail: 'Served on active duty in the U.S. military during a war or in a campaign or expedition for which a campaign badge is awarded' },
      { code: 'medal', description: 'Armed Forces Service Medal Veteran', detail: 'While serving on active duty in the Armed Forces, participated in a United States military operation for which an Armed Forces service medal was awarded pursuant to Executive Order 12985.' }
    ];

    vm.eoeData = {
      byGender: {},
      byEthnicity: {},
      byRace: { 'multiple': 0, 'declined' : 0},
      byDisability: {},
      byVeteran: {}
    };

    function parseDemographic(result, opening) {
      var demographicData = (_.find(result, function(data) {
        return (data.type === "demographic");
      })).data;
      if (vm.opening !== "all") {
         demographicData = _.filter(demographicData, function(rec) {
           console.log(rec._id);
          return (rec.opening._id === opening);
        });
      };
      _.forEach(vm.options.genders, function(gender) {
        var genderCount=_.size(_.filter(demographicData, function(rec) {
          return (rec.gender === gender.code);
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
        consolelog(race.description + ' count is ' + raceCount);
        vm.eoeData.byRace[race.code] = { "count" : raceCount, "label" : race.description };
      });
      vm.eoeData.byRace.multiple = _.size(_.filter(demographicData, function(rec) {
        return _.size(_.keys(_.pick(rec.race, _.identity))) > 1;
      }));
    }

    function parseDisability(result) {
      var disabilityData = (_.find(result, function(data) {
        return data.type === "disability";
      })).data;
      _.forEach(vm.options.disabilities, function(option) {
        var disabilityCount=_.size(_.filter(disabilityData, function(rec) {
          return rec.disability === option.code;
        }));
        console.log(option.description + ' count is ' + disabilityCount);
        vm.eoeData.byDisability[option.code] = { "count": disabilityCount, "label" : option.description};
      });
    }

    function parseVeteran(result) {
      var veteranData = (_.find(result, function(data) {
        return data.type === "veteran";
      })).data;
      _.forEach(vm.options.veterans, function(option) {
        var veteranCount=_.size(_.filter(veteranData, function(rec) {
          return rec.veteran === option.code;
        }));
        console.log(option.description + ' count is ' + veteranCount);
        vm.eoeData.byVeteran[option.code] = { "count": veteranCount, "label" : option.description};
      });
    }

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation

      var actions = Eoe.getActions(); // get the actions from the Model
      actions.splice(1, 2); // splice out the ones we don't want (were taking them all out here)

      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('EOE Data - Demographics'); // set the page title
    }

    function activate () {
      $scope._ = _;
      getValueLists();
      Eoe.query()
          .$promise
          .then(function(result) {
               vm.rawData = result;
               parseDemographic(result, vm.opening);
               parseDisability(result);
               parseVeteran(result);
          });

      setupNavigation();
    }

    function getValueLists() {
      Opening.query().$promise
          .then(function(result) {
            vm.options.openings = result;
          })
          .catch(function(error) {
            Messages.addMessage(error.data.message, 'error');
          });
    }

    function viewEoe (Eoe) {
      $state.go('main.viewEoe', { EoeId: Eoe._id });
    }


    activate();

  }
})();
