(function () {
  'use strict';
  angular
    .module('eoe')
    .controller('ListEoeController', ListEoeController);

  function ListEoeController($scope, $state, Navigation, Eoe, Messages, Application, Position, resolvedAuth, _) {
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
    vm.filterByType = filterByType;
    vm.filterByDate = filterByDate;
    vm.filterByPosition = filterByPosition;
    vm.rawData = [];
    vm.position = "";
    vm.applicationCount = -2;
    vm.datePickerStates = {dateCloseOpen: false, datePostedOpen: false, dateRequestedOpen: false, dateStartOpen: false};
    vm.toggleDatePicker = toggleDatePicker;
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
      reportDataInit();
      getApplicationCount();
      parseDemographic(vm.rawData, vm.position);
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


    vm.options.races = [
      {
        code: 'native',
        description: 'American Indian or Alaskan Native',
        orderBy: 1,
        detail: 'Having origins in any of the original peoples of North and South America' +
        ' (including Central America), and who maintain tribal affiliation or community attachment'
      },
      {
        code: 'asian',
        description: 'Asian',
        orderBy: 2,
        detail: 'Having origins in any of the original peoples of the Far East, Southeast Asia, or the Indian Subcontinent, including, for example, Cambodia, China, India, Japan, Korea, Malaysia, Pakistan, the Philippine Islands, Thailand, and Vietnam'
      },
      {
        code: 'black',
        description: 'Black or African American',
        orderBy: 3,
        detail: 'Having origins in any of the black racial groups of Africa' },
      {
        code: 'pacific',
        description: 'Native Hawaiian or Other Pacific Islander',
        orderBy: 4,
        detail: 'Having origins in any of the peoples of Hawaii, Guam, Samoa, or other Pacific Islands' },
      {
        code: 'white',
        description: 'White',
        orderBy: 5,
        detail:'A person having origins in any of the original peoples of Europe, the Middle East, or North Africa'
      },
      {
        code: 'other',
        description: 'Other',
        orderBy: 6
      },
      {
        code: 'declined',
        description: 'Declined',
        orderBy: 89
      }
    ];

    vm.options.genders = [
      { code: 'm',
        orderBy: 2,
        description: 'Male' },
      { code: 'f',
        orderBy: 1,
        description: 'Female' },
      { code: 'd',
        orderBy: 89,
        description: 'Declined' }
    ];

    vm.options.ethnicities = [
      {
      code: 'h',
      description: 'Hispanic or Latino',
        orderBy: 1,
      detail: 'Of Cuban, Mexican, Puerto Rican, South or Central American, or other Spanish culture or origin regardless of race.'
    },
      {
        code: 'n',
        orderBy: 2,
        description: 'Not Hispanic or Latino'
      },
      {
        code: 'd',
        orderBy: 89,
        description: 'Declined to Answer'
      }
    ];
    vm.options.disabilities = [
        {
        code: 'y',
          orderBy: 1,
          description: 'Yes'
      },
        {
          code: 'n',
          orderBy: 2,
          description: 'No'
        },
        {
          code: 'd',
          orderBy: 89,
          description: 'Declined to Answer'
        }
      ];

    vm.options.veterans = [
      {
        code: 'yes-id',
        orderBy: 1,
        description: 'Yes, identify as veteran'
      },
      {
        code: 'yes-not-id',
        orderBy: 2,
        description: 'Yes, but do not identify'
      },
      {
        code: 'no',
        orderBy: 3,
        description: 'No'
      },
      {
        code: 'declined',
        orderBy: 89,
        description: 'Declined to Answer'
      }
    ];

    vm.options.vetClasses = [
      { code: 'disabled',         orderBy: 1,
        description: 'Disabled Veteran' },
      { code: 'recent',         orderBy: 2,
        description: 'Recently Separated Veteran', detail: 'Discharged or released from active duty within 36 months' },
      { code: 'active',         orderBy: 3,
        description: 'Active Duty Wartime or Campaign Badge Veteran', detail: 'Served on active duty in the U.S. military during a war or in a campaign or expedition for which a campaign badge is awarded' },
      { code: 'medal',         orderBy: 4,
        description: 'Armed Forces Service Medal Veteran', detail: 'While serving on active duty in the Armed Forces, participated in a United States military operation for which an Armed Forces service medal was awarded pursuant to Executive Order 12985.' }
    ];

    function reportDataInit() {
      vm.eoeData = {
        byGender: {},
        byEthnicity: {},
        byRace: {
          "multiple": {
            "counts" : {
              "totalCount" : 0
            },
            "label" : "Multiple",
            "orderBy" : 10
          }
        },
        byDisability: {},
        byVeteran: {},
        totalCount: 0
      };
    }

    // Filter by EOE data type
    function filterByType(result, dataType) {
      var typeData = (_.find(result, function(data) {
        return (data.type === dataType);
      })).data;
      return typeData;
    }

    // Filter for Position
    function filterByPosition(data){
      if (vm.position !== "") {
        data = _.filter(data, function(rec) {
          console.log(rec._id);
          return (rec.position === vm.position);
        });
      }
      return data;
    }

    //TODO add validation for data ranges
    function filterByDate(data) {
      var dateStart = new Date(angular.isDate(vm.dateStart) ? vm.dateStart : '1/1/1900');
      var dateEnd = new Date(angular.isDate(vm.dateEnd) ? (vm.dateEnd).setDate((vm.dateEnd).getDate()+1) : '12/31/2029');
      //var dateEnd = new Date((vm.dateEnd).setDate((vm.dateEnd).getDate()+1));
      data = _.filter(data, function(rec) {
        var eoeDateCreated = new Date(rec.dateCreated);

        console.log(dateStart + ' ' + dateEnd + '' + eoeDateCreated);
        return (eoeDateCreated >= dateStart && eoeDateCreated <= dateEnd);
      });
      //TODO total account will be number of applicants
      vm.eoeData.totalCount = _.size(data);
      return data;
    }

    function parseDemographic(result) {

      // FILTER EOE DATA FOR DEMOGRAPHIC DATA (Gender, Race, Ethnicity)

      var demographicData = vm.filterByType(result, 'demographic');
      demographicData = vm.filterByPosition(demographicData);
      demographicData = vm.filterByDate(demographicData);

      // APPLICANTS BY GENDER

      _.forEach(vm.options.genders, function(gender) {
        var genderCount=_.size(_.filter(demographicData, function(rec) {
          return (rec.gender === gender.code);
        }));
        console.log(gender.description + ' count is ' + genderCount);
        vm.eoeData.byGender[gender.code] = { "count": genderCount, orderBy: gender.orderBy, "label" : gender.description, "code": gender.code};
      });


      // APPLICANTS BY ETHNICITY x GENDER

      _.forEach(vm.options.ethnicities, function(ethnicity) {
        vm.eoeData.byEthnicity[ethnicity.code] = { label: ethnicity.description, orderBy: ethnicity.orderBy, counts: { totalCount : 0 }} ;
        _.forEach(vm.options.genders, function(gender) {
          var ethnicityCount =_.size(_.filter(demographicData, function(rec) {
            return (rec.ethnicity === ethnicity.code && rec.gender === gender.code);
          }));
          console.log(ethnicity.description + ' - ' + gender.description + ' count is ' + ethnicityCount);
          vm.eoeData.byEthnicity[ethnicity.code].counts[gender.code] = ethnicityCount;
          vm.eoeData.byEthnicity[ethnicity.code].counts.totalCount += ethnicityCount;
        });
      });


      // APPLICANTS BY RACE x GENDER

      _.forEach(vm.options.races, function(race) {
        vm.eoeData.byRace[race.code] = {label: race.description, orderBy: race.orderBy, counts: {totalCount: 0}};
        _.forEach(vm.options.genders, function (gender) {
          var raceCount = _.size(_.filter(demographicData, function (rec) {
            return (rec.race[race.code] === true && rec.gender === gender.code);
          }));
          console.log(race.description + ' - ' + gender.description + ' count is ' + raceCount);
          vm.eoeData.byRace[race.code].counts[gender.code] = raceCount;
          vm.eoeData.byRace[race.code].counts.totalCount += raceCount;
        });
      });

      // APPLICANTS OF MULTIPLE RACE x GENDER
      _.forEach(vm.options.genders, function (gender) {
        var raceCount =  _.size(_.filter(demographicData, function (rec) {
          return ((_.size(_.keys(_.pick(rec.race, _.identity))) > 1) && rec.gender === gender.code);
        }));
        vm.eoeData.byRace.multiple.counts[gender.code] = raceCount;
        vm.eoeData.byRace.multiple.counts.totalCount += raceCount;
      });
    }


    // APPLICANTS BY DISABILITY STATUS x GENDER
    function parseDisability(result) {

      // FILTER EOE DATA FOR DISABILITY STATUS DATA

      var disabilityData = vm.filterByType(result, 'disability');
      disabilityData = vm.filterByPosition(disabilityData);
      disabilityData = vm.filterByDate(disabilityData);

      // APPLICANTS BY DISABILITY x GENDER
      _.forEach(vm.options.disabilities, function (option) {

        vm.eoeData.byDisability[option.code] = {
          label: option.description,
          orderBy: option.orderBy,
          counts: {totalCount: 0}
        };
        _.forEach(vm.options.genders, function (gender) {
          var disabilityCount = _.size(_.filter(disabilityData, function (rec) {
            return (rec.disability === option.code && rec.gender === gender.code);
          }));
          console.log(option.description + ' - ' + gender.code + ' count is ' + disabilityCount);
          vm.eoeData.byDisability[option.code].counts[gender.code] = disabilityCount;
          vm.eoeData.byDisability[option.code].counts.totalCount += disabilityCount;
        });
      });
    }
    
    // APPLICANTS BY VETERAN IDENTIFICATION x GENDER
    function parseVeteran(result) {

      // FILTER EOE DATA FOR VETERAN IDENTIFICATION DATA
      var veteranData = vm.filterByType(result, 'veteran');
      veteranData= vm.filterByPosition(veteranData);
      veteranData = vm.filterByDate(veteranData);

      // APPLICANTS BY VETERAN x GENDER
      _.forEach(vm.options.veterans, function (option) {
        vm.eoeData.byVeteran[option.code] = {
          label: option.description,
          orderBy: option.orderBy,
          counts: {totalCount: 0},
          classes: {}
        };
        _.forEach(vm.options.genders, function (gender) {
          var veteranCount = _.size(_.filter(veteranData, function (rec) {
            return (rec.veteran === option.code && rec.gender === gender.code);
          }));
          console.log(option.description + ' - ' + gender.code + ' count is ' + veteranCount);
          vm.eoeData.byVeteran[option.code].counts[gender.code] = veteranCount;
          vm.eoeData.byVeteran[option.code].counts.totalCount += veteranCount;
        });
      });

      // APPLICANTS BY VET CLASS X GENDER
      var vetClassData = vm.eoeData.byVeteran['yes-id'].classes;
      _.forEach(vm.options.vetClasses, function (option) {
        vetClassData[option.code] = {
          label: option.description,
          orderBy: option.orderBy,
          counts: {totalCount: 0}
        };
        _.forEach(vm.options.genders, function (gender) {
          var veteranCount = _.size(_.filter(veteranData, function (rec) {
            if (_.has(rec, 'vetClass')) {
              return (rec.vetClass[option.code] === true && rec.gender === gender.code);
            }
            else {
              return false;
            }
          }));
          console.log(option.description + ' - ' + gender.code + ' count is ' + veteranCount);
          vetClassData[option.code].counts[gender.code] = veteranCount;
          vetClassData[option.code].counts.totalCount += veteranCount;
        });
      });
    }

    function getApplicationCount() {
      var dateStart = new Date(angular.isDate(vm.dateStart) ? vm.dateStart : '1/1/1900');
      var dateEnd = new Date(angular.isDate(vm.dateEnd) ? (vm.dateEnd).setDate((vm.dateEnd).getDate()+1) : '12/31/2029');
      var position = vm.position ? vm.position : 'all';

      Application.countByDate({dateStart: dateStart, dateEnd: dateEnd, position: position})
          .$promise
          .then(function(results) {
            vm.applicationCount = results.count;
          })
          .catch(function(error) {
            Messages.addMessage(error.data.message, 'error');
          });
    }

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation

      var actions = Eoe.getActions(); // get the actions from the Model
      actions.splice(1, 2); // splice out the ones we don't want (were taking them all out here)

      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('EOE Report'); // set the page title
    }

    function activate () {
      $scope._ = _;
      getValueLists();
      Eoe.query()
          .$promise
          .then(function (result) {
            vm.rawData = result;
            reportDataInit();
            parseDemographic(result, vm.position);
            parseDisability(result, vm.position);
            parseVeteran(result);
            setupNavigation();
          });
      getApplicationCount();
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

    function toggleDatePicker(event, datePicker) {
      var datePickerOpenName = datePicker + 'Open';
      vm.datePickerStates[datePickerOpenName] = !vm.datePickerStates[datePickerOpenName];
    }

    function viewEoe (Eoe) {
      $state.go('main.viewEoe', { EoeId: Eoe._id });
    }


    activate();

  }
})();
