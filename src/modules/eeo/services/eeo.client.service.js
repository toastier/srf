(function () {
  'use strict';
  angular
    .module('eeo')
    .factory('Eeo', Eeo)

  function Eeo($resource, $state, $stateParams) {
    var Eeo = $resource('eeo/:eeoId', {eeoId: '@_id'}, {
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST',
        url: 'eeo/create/:applicationId',
        params: { applicationId : '@applicationId'}
      }
    });

    var methods = {
      createEeo: function () {
        $state.go('main.createEeo', {applicationID: $stateParams.applicationID});
      }
    };

    /**
     * Methods to add to each result returned by $resource
     * @type {Object} itemMethods
     */
    var itemMethods = {

    };

    /**
     * Methods to add to the Model
     * @type {{listEeo: Function, getActions: Function}}
     */
    var modelMethods = {

      listEeo: function () {
        $state.go('main.listEeo');
      },
      getActions: function () {
        var modelActions = [
        ];
        return angular.copy(modelActions);
      },
      getOptions: function () {
          var options = {
            ethnicities: [
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
            ],
            genders: [
              {
                code: 'f',
                description: 'Female',
              },
              {
                code: 'm',
                description: 'Male'
              },
              {
                code: 'd',
                description: 'Declined to Answer'
              }
            ],

            races: [{
              code: 'native',
              description: 'American Indian or Alaskan Native',
              detail: 'Having origins in any of the original peoples of North and South America (including Central America), and who maintain tribal affiliation or community attachment'
            },
              {
                code: 'asian',
                description: 'Asian',
                detail: 'Having origins in any of the original peoples of the Far East, Southeast Asia, or the Indian Subcontinent, including, for example, Cambodia, China, India, Japan, Korea, Malaysia, Pakistan, the Philippine Islands, Thailand, and Vietnam'
              },
              {
                code: 'black',
                description: 'Black or African American',
                detail: 'Having origins in any of the black racial groups of Africa'
              },
              {
                code: 'pacific',
                description: 'Native Hawaiian or Other Pacific Islander',
                detail: 'Having origins in any of the peoples of Hawaii, Guam, Samoa, or other Pacific Islands'
              },
              {
                code: 'white',
                description: 'White',
                detail: 'A person having origins in any of the original peoples of Europe, the Middle East, or North Africa'
              },
              {code: 'other', description: 'Other'}
            ],
            vetClasses: [
              {code: 'disabled', description: 'Disabled Veteran'},
              {
                code: 'recent',
                description: 'Recently Separated Veteran',
                detail: 'Discharged or released from active duty within 36 months'
              },
              {
                code: 'active',
                description: 'Active Duty Wartime or Campaign Badge Veteran',
                detail: 'Served on active duty in the U.S. military during a war or in a campaign or expedition for which a campaign badge is awarded'
              },
              {
                code: 'medal',
                description: 'Armed Forces Service Medal Veteran',
                detail: 'While serving on active duty in the Armed Forces, participated in a United States military operation for which an Armed Forces service medal was awarded pursuant to Executive Order 12985.'
              }
            ],
            disabilities: [
              {description: 'Blindness'},
              {description: 'Deafness'},
              {description: 'Cancer'},
              {description: 'Diabetes'},
              {description: 'Autism'},
              {description: 'Cerebral palsy'},
              {description: 'HIV/AIDS'},
              {description: 'Schizophrenia'},
              {description: 'Muscular dystrophy'},
              {description: 'Bipolar disorder'},
              {description: 'Major depression'},
              {description: 'Multiple sclerosis (MS)'},
              {description: 'Missing limbs or partially missing limbs'},
              {description: 'Post-traumatic stress disorder (PTSD)'},
              {description: 'Obsessive compulsive disorder'},
              {description: 'Impairments requiring the use of a wheelchair'},
              {description: 'Intellectual disability (previously called mental retardation)'}
            ]
          }
          return options;
      }
    };

    /**
     * Extend Eeo with the methods
     */
    angular.extend(Eeo.prototype, itemMethods);

    angular.extend(Eeo, modelMethods);


    return Eeo;
  }


})();