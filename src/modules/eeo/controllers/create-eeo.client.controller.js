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
                      vm.eeo = new Eeo();
                      vm.options = Eeo.getOptions();
                      vm.saveEeo = saveEeo;
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
        for(var race in vm.options.races) {
            var code = vm.options.races[race].code;
            if (vm.eeo.race[code] === true) {
                console.log('race is ', vm.eeo.race[code])
                vm.eeo.race.declined = false;
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
      return angular.isUndefined(vm.eeoForm) || vm.eeoForm.$invalid || vm.eeoForm.$pristine || vm.eeoSaved;
    }


    //function getPosition(positionId) {
    //  var matched = false;
    //  angular.forEach(vm.options.positions, function(position) {
    //    if (!matched && positionId === position._id) {
    //      matched = position;
    //    }
    //  });
    //  return matched;
    //}
    //
    //function fillPositionInfo() {
    //  var position = getPosition(vm.eeo.position);
    //  vm.eeo.name = position.name;
    //  vm.eeo.details = position.details;
    //}

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
    }
  }
})();
