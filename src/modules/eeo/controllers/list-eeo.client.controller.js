(function () {
  'use strict';
  angular
    .module('eeo')
    .controller('ListEeoController', ListEeoController);

  function ListEeoController($scope, $state, Navigation, Eeo, Messages, Application, Position, resolvedAuth, _) {
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
    vm.filterByReportType = filterByReportType;
    vm.rawData = [];
    vm.position = "";
    vm.applicationCount = 0;
    vm.interviewCount = 0;
    vm.hired = [];
    vm.datePickerStates = {
      dateCloseOpen: false,
      datePostedOpen: false,
      dateRequestedOpen: false,
      dateStartOpen: false
    };
    vm.toggleDatePicker = toggleDatePicker;
    vm.options = {};
    vm.clearFilters = clearFilters;

    function allowView() {
      return true;
    }


    function allowEdit() {
      return vm.user.hasRole(['admin']);
    }

    function raceCount(code, eeoData) {
      return _.filter(eeoData, function (data) {
        return (data.race[code] === true)
      }).length;
    }

    function extractData() {
      reportDataInit();
      getApplicationCount();
      getInterviewCount();
      parseDemographic(vm.rawData, 'self');
      parseDemographic(vm.rawData, 'interview');
      parseDisability(vm.rawData);
      parseVeteran(vm.rawData);
    }

    function setIsActive(source) {
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
        detail: 'Having origins in any of the black racial groups of Africa'
      },
      {
        code: 'pacific',
        description: 'Native Hawaiian or Other Pacific Islander',
        orderBy: 4,
        detail: 'Having origins in any of the peoples of Hawaii, Guam, Samoa, or other Pacific Islands'
      },
      {
        code: 'white',
        description: 'White',
        orderBy: 5,
        detail: 'A person having origins in any of the original peoples of Europe, the Middle East, or North Africa'
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
      {
        code: 'm',
        orderBy: 2,
        description: 'Male'
      },
      {
        code: 'f',
        orderBy: 1,
        description: 'Female'
      },
      {
        code: 'd',
        orderBy: 89,
        description: 'Declined'
      }
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
      {
        code: 'disabled', orderBy: 1,
        description: 'Disabled Veteran'
      },
      {
        code: 'recent',
        orderBy: 2,
        description: 'Recently Separated Veteran',
        detail: 'Discharged or released from active duty within 36 months'
      },
      {
        code: 'active',
        orderBy: 3,
        description: 'Active Duty Wartime or Campaign Badge Veteran',
        detail: 'Served on active duty in the U.S. military during a war or in a campaign or expedition for which a campaign badge is awarded'
      },
      {
        code: 'medal',
        orderBy: 4,
        description: 'Armed Forces Service Medal Veteran',
        detail: 'While serving on active duty in the Armed Forces, participated in a United States military operation for which an Armed Forces service medal was awarded pursuant to Executive Order 12985.'
      }
    ];

    function reportDataInit() {
      vm.eeoData = {
        byGender: {},
        byEthnicity: {},
        byRace: {
          "multiple": {
            "counts": {
              "totalCount": 0
            },
            "label": "Multiple",
            "orderBy": 10
          }
        },
        byDisability: {},
        byVeteran: {},
        totalCount: 0,
        totalCounts: {}
      };
    }

    // Filter by EEO data type
    function filterByType(result, dataType) {
      var typeData = (_.find(result, function (data) {
        return (data.type === dataType);
      })).data;
      return typeData;
    }

    // Filter for Position
    function filterByPosition(data) {
      if (vm.position !== "") {
        data = _.filter(data, function (rec) {
          return (rec.position === vm.position);
        });
      }
      return data;
    }

    // Filter by EEO reporting type (self vs interview)
    function filterByReportType(data, rptType) {
      data = _.filter(data, function (rec) {
        return (rec.reportType === rptType);
      });
      return data;
    }


    //TODO add validation for data ranges
    function filterByDate(data) {
      var dateStart = new Date(angular.isDate(vm.dateStart) ? vm.dateStart : '1/1/1900');
      var dateEnd = new Date(angular.isDate(vm.dateEnd) ? (vm.dateEnd).setDate((vm.dateEnd).getDate()+1) : '12/31/2029');
      //var dateEnd = new Date((vm.dateEnd).setDate((vm.dateEnd).getDate()+1));
      data = _.filter(data, function(rec) {
        var eeoDateCreated = new Date(rec.dateCreated);
        return (eeoDateCreated >= dateStart && eeoDateCreated <= dateEnd);
      });
      vm.eeoData.totalCount = _.size(data);
      return data;
    }

    function parseDemographic(result, reportType) {

      var demographicData = vm.filterByType(result, 'demographic');
      demographicData = vm.filterByReportType(demographicData, reportType);
      demographicData = vm.filterByPosition(demographicData);
      demographicData = vm.filterByDate(demographicData);

      // APPLICANTS BY GENDER
      vm.eeoData.totalCounts.byGender = demographicData.length;
      _.forEach(vm.options.genders, function(gender) {
        var genderCount=_.size(_.filter(demographicData, function(rec) {
          return (rec.gender === gender.code);
        }));
        vm.eeoData.byGender[gender.code] = vm.eeoData.byGender[gender.code] ? vm.eeoData.byGender[gender.code] : {
          "count": {},
          "orderBy": gender.orderBy,
          "label" : gender.description,
          "code": gender.code
        };
        vm.eeoData.byGender[gender.code].count[reportType] = genderCount;
      });

      // APPLICANTS BY ETHNICITY x GENDER
      vm.eeoData.totalCounts.byEthnicity = demographicData.length;
      _.forEach(vm.options.ethnicities, function(ethnicity) {
        //vm.eeoData.byEthnicity[ethnicity.code] = vm.eeoData.byEthnicity[ethnicity.code] ?
            //vm.eeoData.byEthnicity[ethnicity.code] : { label: ethnicity.description, orderBy: ethnicity.orderBy, counts: { totalCount : {} }} ;
        vm.eeoData.byEthnicity[ethnicity.code] = vm.eeoData.byEthnicity[ethnicity.code] || { label: ethnicity.description, orderBy: ethnicity.orderBy, counts: { totalCount : {} }} ;
        _.forEach(vm.options.genders, function(gender) {
          var ethnicityCount =_.size(_.filter(demographicData, function(rec) {
            return (rec.ethnicity === ethnicity.code && rec.gender === gender.code);
          }));
          vm.eeoData.byEthnicity[ethnicity.code].counts[gender.code] = vm.eeoData.byEthnicity[ethnicity.code].counts[gender.code] || {};
          vm.eeoData.byEthnicity[ethnicity.code].counts[gender.code][reportType] = ethnicityCount;
          vm.eeoData.byEthnicity[ethnicity.code].counts.totalCount = vm.eeoData.byEthnicity[ethnicity.code].counts.totalCount || {};
          vm.eeoData.byEthnicity[ethnicity.code].counts.totalCount[reportType] = vm.eeoData.byEthnicity[ethnicity.code].counts.totalCount[reportType] || 0;
          vm.eeoData.byEthnicity[ethnicity.code].counts.totalCount[reportType] += ethnicityCount;
        });
      });


      // APPLICANTS BY RACE x GENDER
      vm.eeoData.totalCounts.byRace = demographicData.length;
      _.forEach(vm.options.races, function(race) {
        vm.eeoData.byRace[race.code] = {label: race.description, orderBy: race.orderBy, counts: {totalCount: 0}};
        _.forEach(vm.options.genders, function (gender) {
          var raceCount = _.size(_.filter(demographicData, function (rec) {
            return (rec.race[race.code] === true && rec.gender === gender.code);
          }));
          vm.eeoData.byRace[race.code].counts[gender.code] = raceCount;
          vm.eeoData.byRace[race.code].counts.totalCount += raceCount;
        });
      });

      // APPLICANTS OF MULTIPLE RACE x GENDER
      _.forEach(vm.options.genders, function (gender) {
        var raceCount =  _.size(_.filter(demographicData, function (rec) {
          return ((_.size(_.keys(_.pick(rec.race, _.identity))) > 1) && rec.gender === gender.code);
        }));
        vm.eeoData.byRace.multiple.counts[gender.code] = raceCount;
        vm.eeoData.byRace.multiple.counts.totalCount += raceCount;
      });
    }


    // APPLICANTS BY DISABILITY STATUS x GENDER
    function parseDisability(result) {

      // FILTER EEO DATA FOR DISABILITY STATUS DATA

      var disabilityData = vm.filterByType(result, 'disability');
      disabilityData = vm.filterByPosition(disabilityData);
      disabilityData = vm.filterByDate(disabilityData);

      // APPLICANTS BY DISABILITY x GENDER
      vm.eeoData.totalCounts.byDisability = disabilityData.length;
      _.forEach(vm.options.disabilities, function (option) {
        vm.eeoData.byDisability[option.code] = {
          label: option.description,
          orderBy: option.orderBy,
          counts: {totalCount: 0}
        };
        _.forEach(vm.options.genders, function (gender) {
          var disabilityCount = _.size(_.filter(disabilityData, function (rec) {
            return (rec.disability === option.code && rec.gender === gender.code);
          }));
          vm.eeoData.byDisability[option.code].counts[gender.code] = disabilityCount;
          vm.eeoData.byDisability[option.code].counts.totalCount += disabilityCount;
        });
      });
    }
    
    // APPLICANTS BY VETERAN IDENTIFICATION x GENDER
    function parseVeteran(result) {

      // FILTER EEO DATA FOR VETERAN IDENTIFICATION DATA
      var veteranData = vm.filterByType(result, 'veteran');
      veteranData= vm.filterByPosition(veteranData);
      veteranData = vm.filterByDate(veteranData);

      // APPLICANTS BY VETERAN x GENDER
      vm.eeoData.totalCounts.byVeteran = veteranData.length;
      _.forEach(vm.options.veterans, function (option) {
        vm.eeoData.byVeteran[option.code] = {
          label: option.description,
          orderBy: option.orderBy,
          counts: {totalCount: 0},
          classes: {}
        };
        _.forEach(vm.options.genders, function (gender) {
          var veteranCount = _.size(_.filter(veteranData, function (rec) {
            return (rec.veteran === option.code && rec.gender === gender.code);
          }));
          vm.eeoData.byVeteran[option.code].counts[gender.code] = veteranCount;
          vm.eeoData.byVeteran[option.code].counts.totalCount += veteranCount;
        });
      });

      // APPLICANTS BY VET CLASS X GENDER
      var vetClassData = vm.eeoData.byVeteran['yes-id'].classes;
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
          vetClassData[option.code].counts[gender.code] = veteranCount;
          vetClassData[option.code].counts.totalCount += veteranCount;
        });
      });
    }

    function getApplicationCount() {
      var dateStart = new Date(angular.isDate(vm.dateStart) ? vm.dateStart : '1/1/1900');
      var dateEnd = new Date(angular.isDate(vm.dateEnd) ? (vm.dateEnd).setDate((vm.dateEnd).getDate()+1) : '12/31/2029');
      var position = (vm.position !== "") ? vm.position : 'all';

      Application.countByDate({dateStart: dateStart, dateEnd: dateEnd, position: position})
          .$promise
          .then(function(results) {
            vm.applicationCount = results.count;
            vm.hired = results.hired;
          })
          .catch(function(error) {
            Messages.addMessage(error.data.message, 'error');
          });
    }

    function getInterviewCount() {
      var dateStart = new Date(angular.isDate(vm.dateStart) ? vm.dateStart : '1/1/1900');
      var dateEnd = new Date(angular.isDate(vm.dateEnd) ? (vm.dateEnd).setDate((vm.dateEnd).getDate()+1) : '12/31/2029');
      var position = (vm.position !== "") ? vm.position : 'all';

      Application.interviewCountByDate({dateStart: dateStart, dateEnd: dateEnd, position: position})
          .$promise
          .then(function(results) {
            vm.interviewCount = results.count;
          })
          .catch(function(error) {
            Messages.addMessage(error.data.message, 'error');
          });
    }

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation

      var actions = Eeo.getActions(); // get the actions from the Model
      actions.splice(1, 2); // splice out the ones we don't want (were taking them all out here)

      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('Equal Employment Opportunity Report'); // set the page title
    }

    function activate () {
      $scope._ = _;
      getValueLists();
      Eeo.query()
          .$promise
          .then(function (result) {
            vm.rawData = result;
            reportDataInit();
            parseDemographic(result,'self');
            parseDemographic(result,'interview');
            parseDisability(result);
            parseVeteran(result);
            setupNavigation();
          });
      getApplicationCount();
      getInterviewCount();
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

    function viewEeo (Eeo) {
      $state.go('main.viewEeo', { EeoId: Eeo._id });
    }

    function clearFilters() {
      vm.position = '';
      vm.dateStart = null;
      vm.dateEnd = null;
      vm.extractData();
    }

    activate();

  }
})();
