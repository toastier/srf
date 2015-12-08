/* EEO classification details sources:
 - http://www.eeoc.gov/employers/eeo1survey/2007instructions.cfm
 - http://www.dol.gov/vets/contractor/main.htm
 */

(function () {
  'use strict';
  angular
    .module('eeo')
    .controller('CreateEeoController', CreateEeoController);


  /* @ngInject */
  function CreateEeoController(Messages, Navigation, Application, Opening, Eeo, $state, $stateParams,  _) {
      var vm = this;
      Application.checkForExistingEeo({applicationId: $stateParams.applicationId}).$promise
          .then(function(result) {
                 if (result.eeoProvided) {
                     console.log('The EEO flag value is ', result);
                     Messages.addMessage('EEO data has already been submitted for this application and cannot be altered once submitted.');
                     $state.go('main.listOpenings');
                 }
                 else {
                      vm.eeoSaved = false;
                      vm.disableSaveButton = disableSaveButton;
                      vm.eeo = new Eeo({disability: null});
                      vm.saveEeo = saveEeo;
                      vm.options = { };
                      vm.declineOff = declineOff;
                      vm.flagOff = flagOff;
                      vm.declineAnswer = declineAnswer;
                      vm.setSelection = setSelection;
                      vm.returnToOpenings = returnToOpenings;

                      activate();

                  }
          });



      function returnToOpenings() {
        $state.go('main.listOpenings');
      }

      function declineOff() {
      //if (vm.eeo.race.declined === 'true') {
        for(var race in vm.eeo.race) {
          if (vm.eeo.race[race] === true) {
            console.log('race is ', vm.eeo.race[race])
            vm.eeo.race.declined = false;
          }
        }
      //}
    }

   function setSelection($event, key, value) {
      var checkbox = $event.target;
      if (checkbox.checked) {
        key = value;
      }
    }

    // Set flag to FALSE if any of the options are true,
    // i.e, set Decline To Answer to false if any preceding options are true
    function flagOff(flag, options) {
      if (flag === 'true') {
        for(var option in options) {
          if (options[option] === true) {
            flag = false;
          }
        }
      }
    }

    // Set all options to false TODO pass an array of values to ignore instead of hardcoded 'declined'
    function declineAnswer(options) {
      for(var option in options) {
        if (option !== 'declined') {
          options[option] = false;
        }
      }
    }


    function disableSaveButton() {
      return angular.isUndefined(vm.eeoForm) || vm.eeoForm.$invalid || vm.eeoForm.$pristine || vm.eeoSaved;
    }


    function getPosition(positionId) {
      var matched = false;
      angular.forEach(vm.options.positions, function(position) {
        if (!matched && positionId === position._id) {
          matched = position;
        }
      });
      return matched;
    }

    function getValueLists() {

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
        { code: 'other', description: 'Other' }
      ];
        vm.options.vetClasses = [
        { code: 'disabled', description: 'Disabled Veteran' },
        { code: 'recent', description: 'Recently Separated Veteran', detail: 'Discharged or released from active duty within 36 months' },
        { code: 'active', description: 'Active Duty Wartime or Campaign Badge Veteran', detail: 'Served on active duty in the U.S. military during a war or in a campaign or expedition for which a campaign badge is awarded' },
        { code: 'medal', description: 'Armed Forces Service Medal Veteran', detail: 'While serving on active duty in the Armed Forces, participated in a United States military operation for which an Armed Forces service medal was awarded pursuant to Executive Order 12985.' }
      ];
      vm.options.ethnicities = [{
          code: 'hispanic',
          description: 'Hispanic or Latino',
          detail: 'Of Cuban, Mexican, Puerto Rican, South or Central American, or other Spanish culture or origin regardless of race.'
      }];
    vm.options.disabilities = [
        { description: 'Blindness'},
        { description: 'Deafness'},
        { description: 'Cancer'},
        { description: 'Diabetes'},
        { description: 'Autism'},
        { description: 'Cerebral palsy'},
        { description: 'HIV/AIDS'},
        { description: 'Schizophrenia'},
        { description: 'Muscular dystrophy'},
        { description: 'Bipolar disorder'},
        { description: 'Major depression'},
        { description: 'Multiple sclerosis (MS)'},
        { description: 'Missing limbs or partially missing limbs'},
        { description: 'Post-traumatic stress disorder (PTSD)'},
        { description: 'Obsessive compulsive disorder'},
        { description: 'Impairments requiring the use of a wheelchair'},
        { description: 'Intellectual disability (previously called mental retardation)'}
        ]
    }

    function fillPositionInfo() {
      var position = getPosition(vm.eeo.position);
      vm.eeo.name = position.name;
      vm.eeo.details = position.details;
    }

    function saveEeo() {
        Application.checkForExistingEeo({applicationId: $stateParams.applicationId})
            .$promise
            .then(function(result) {
                if (result.eeoProvided) {
                    Messages.addMessage('EEO data already submitted for this application');
                    $state.go('main.listOpenings');
                }
                else {
                    console.log('Saving EEO...');
                    vm.eeo.applicationId = $stateParams.applicationId;
                    Eeo.create(vm.eeo)
                        .$promise
                        .then(function (result) {
                            Messages.addMessage('Thank you for submitted your confidential EEO information.');
                            vm.eeoSaved = true;
                            if (vm.eeo.disability !== 'y') {
                                $state.go('main.listOpenings');
                            }
                            else {
                                var controllerAction =
                                    { title: 'Return to Openings', method: vm.returnToOpenings, type: 'button', style: 'btn-workflow back'};
                                Navigation.actions.clear();
                                Navigation.actions.add(controllerAction);
                            }
                        })
                        .catch(function (error) {
                            Messages.addMessage('There was a problem saving the Eeo ' + error.data.message, 'error');
                        });
                }
            })
        }

    function calculateDates () {
      vm.eeo.calculateDates();
    }

    function setupEeo() {
      vm.eeo.isActive = true;
    }


    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation
      /** @type Array Actions we wish to add to the Navigation that we define locally **/
      //TODO disableIf doesn't work on on second button; want to hideIf, not disable, anyway
      var controllerActions = [
        {title: 'Submit', method: vm.saveEeo, type: 'button', style: 'btn-save', disableIf: vm.disableSaveButton},
        //{title: 'Return to Openings', method: vm.returnToOpenings, type: 'button', style: 'btn-workflow back'}
      ];

      var actions = Eeo.getActions(); // get the actions from the Model
      actions.splice(0, 3); // splice out the ones we don't want (were taking them all out here)
      actions = _.union(actions, controllerActions); // merge together actions defined in the controller with those from the Model
      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set(''); // set the page title
    }



    function activate() {
      setupEeo();
      setupNavigation();
      getValueLists();
    }
  }
})();