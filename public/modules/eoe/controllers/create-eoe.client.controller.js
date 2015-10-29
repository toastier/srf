/* EEO classification details sources:
 - http://www.eeoc.gov/employers/eeo1survey/2007instructions.cfm
 - http://www.dol.gov/vets/contractor/main.htm
 */

(function () {
  'use strict';
  angular
    .module('eoe')
    .controller('CreateEoeController', CreateEoeController);


  /* @ngInject */
  function CreateEoeController(Messages, Navigation, Application, Opening, Eoe, $stateParams,  _) {

    //checkExistingEoe($stateParams.applicationId);
      Application.checkForExistingEoe({applicationId: $stateParams.applicationId}).$promise
          .then(function(application) {
              if (application.eoeProvided) {
                  console.log('The EOE flag value is ', application.eoeProvided);
              }
              else {
                  console.log('The EOE flag value isnt set yet for ', application._id);
                  setEoeProvided(application._id);
              }
          });
          //.catch(function (err) {
          //        Messages.addMessage(err.data.message, 'error');
          //    }))


    /* jshint validthis: true */
    var vm = this;

    vm.disableSaveButton = disableSaveButton;
    vm.eoe = new Eoe();
    vm.saveEoe = saveEoe;
    //vm.saveEoeDisability = saveEoeDisability;
    vm.options = { };
    vm.declineOff = declineOff;
    vm.flagOff = flagOff;
    vm.declineAnswer = declineAnswer;
    vm.setSelection = setSelection;
    //vm.setEoeProvided = setEoeProvided;

    activate();


  //function setEoeProvided(applicationId) {
  //
  //    application.update({
  //        eoeProvided: true
  //    }).$promise
  //        .then(function() {
  //            console.log('Eoe Provided flag set.');
  //        })
  //        .catch(function (err) {
  //            Messages.addMessage(err.data.message, 'error');
  //        });
  //}


    function declineOff() {
      if (vm.eoe.race.declined === 'true') {
        for(var race in vm.eoe.race) {
          if (vm.eoe.race[race] === true) {
            console.log('race is ', vm.eoe.race[race])
            vm.eoe.race.declined = false;
          }
        }
      }
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
      return angular.isUndefined(vm.eoeForm) || vm.eoeForm.$invalid || vm.eoeForm.$pristine;
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
      //Opening.query().$promise
      //    .then(function(result) {
      //      vm.options.openings = result;
      //    })
      //    .catch(function(error) {
      //      Messages.addMessage(error.data.message, 'error');
      //    });
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
      var position = getPosition(vm.eoe.position);
      vm.eoe.name = position.name;
      vm.eoe.details = position.details;
    }

    function saveEoe() {
      console.log('Saving EOE...');
      vm.eoe.$save()
        .then(function (result) {
          Messages.addMessage('The Eoe "' + result.name + '" was saved.', 'success');
          Eoe.listEoe();
        })
        .catch(function (error) {
          Messages.addMessage('There was a problem saving the Eoe ' + error.data.message, 'error');
        });
      //vm.eoeDisability.$save()
      //  .then(function (result) {
      //    Messages.addMessage('The Eoe disability data "' + result.name + '" was saved.', 'success');
      //    //Eoe.listEoe();
      //  })
      //  .catch(function (error) {
      //    Messages.addMessage('There was a problem saving the Eoe Disability ' + error.data.message, 'error');
      //  });
    }

    function calculateDates () {
      vm.eoe.calculateDates();
    }

    function setupEoe() {
      vm.eoe.isActive = true;
    }


    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation
      //Navigation.breadcrumbs.add('Eoe', '#!/eoe', '#!/eoe'); // add a breadcrumb
      /** @type Array Actions we wish to add to the Navigation that we define locally **/
      var controllerActions = [
        {title: 'Submit', method: vm.saveEoe, type: 'button', style: 'btn-save', disableIf: vm.disableSaveButton},
        {title: 'Cancel', method: vm.cancel, type: 'button', style: 'btn-cancel'}
      ];

      var actions = Eoe.getActions(); // get the actions from the Model
      actions.splice(0, 3); // splice out the ones we don't want (were taking them all out here)
      actions = _.union(actions, controllerActions); // merge together actions defined in the controller with those from the Model
      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('EOE Survey'); // set the page title
    }



    function activate() {
      setupEoe();
      setupNavigation();
      getValueLists();
    }
  }
})();
