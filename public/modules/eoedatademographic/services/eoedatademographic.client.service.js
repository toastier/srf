(function () {
  'use strict';
  angular
    .module('eoeDataDemographic')
    .factory('EoeDataDemographic', EoeDataDemographic);

  function EoeDataDemographic($resource, $state, $stateParams) {
    var EoeDataDemographic = $resource('eoeDataDemographic/:eoeDataDemographicId', {eoeDataDemographicId: '@_id'}, {
      update: {
        method: 'PUT'
      }
    });

    var methods = {
      editThisEoeDataDemographic: function () {
        $state.go('main.editEoeDataDemographic', {eoeDataDemographicId: $stateParams.eoeDataDemographicId});
      },
      viewThisEoeDataDemographic: function () {
        $state.go('main.viewEoeDataDemographic', {eoeDataDemographicId: $stateParams.eoeDataDemographicId});
      },
      createEoeDataDemographic: function () {
        $state.go('main.createEoeDataDemographic');
      }
    };

    /**
     * Methods to add to each result returned by $resource
     * @type {Object} itemMethods
     */
    var itemMethods = {
      dateCalculationSettings: {
        openWeeksAfterPost: 0,
        closeWeeksAfterOpen: 8
      },
      addPostingLink: function (source, url) {

        /**
         * PostingLink Constructor
         * @returns {{source: (*|string), url: (*|string)}}
         * @constructor
         */
        function PostingLink () {
          return {
            source: source || '',
            url: url || ''
          };
        }

        if(!this.postingLink || !angular.isArray(this.postingLink)) {
          this.postingLink = [];
        }
        this.postingLink.push(new PostingLink());
      },
      calculateDates: function () {
        var settings = this.dateCalculationSettings;
        settings.openWeeksAfterPost = settings.openWeeksAfterPost || 0;
        settings.closeWeeksAfterOpen = settings.closeWeeksAfterOpen || 8;

        if (!this.dateRequested) {
          this.dateRequested = new Date();
        }

        if (!this.datePosted) {
          var datePosted = new Date(this.dateRequested.toISOString());
          datePosted.setDate(this.dateRequested.getDate() + 7);
          this.datePosted = datePosted;
        }

        var dateStart = new Date(this.datePosted.toISOString());
        dateStart.setDate(this.datePosted.getDate() + parseInt(settings.openWeeksAfterPost, 10) * 7);
        this.dateStart = dateStart;

        var dateClose = new Date(dateStart.toISOString());
        dateClose.setDate(dateStart.getDate() + parseInt(settings.closeWeeksAfterOpen, 10) * 7);
        this.dateClose = dateClose;
      },
      editEoeDataDemographic: function (eoeDataDemographic) {
        $state.go('main.editEoeDataDemographic', {eoeDataDemographicId: eoeDataDemographic._id});
      },
      removePostingLink: function (postingLinkItem) {
        var index = this.postingLink.indexOf(postingLinkItem);
        this.postingLink.splice(index, 1);
      },
      viewEoeDataDemographic: function (eoeDataDemographic) {
        $state.go('main.viewEoeDataDemographic', {eoeDataDemographicId: eoeDataDemographic._id});
      }
    };

    /**
     * Methods to add to the Model
     * @type {{listEoeDataDemographic: Function, getActions: Function}}
     */
    var modelMethods = {

      listEoeDataDemographic: function () {
        $state.go('main.listEoeDataDemographic');
      },
      getActions: function () {
        var modelActions = [
          {title: 'Create a New EoeDataDemographic', method: methods.createEoeDataDemographic, type: 'button', style: 'btn-add'},
          {title: 'View EoeDataDemographic', method: methods.viewThisEoeDataDemographic, type: 'button', style: 'btn-view'},
          {title: 'Edit EoeDataDemographic', method: methods.editThisEoeDataDemographic, type: 'button', style: 'btn-edit'}
        ];
        return angular.copy(modelActions);
      }
    };

    /**
     * Extend EoeDataDemographic with the methods
     */
    angular.extend(EoeDataDemographic.prototype, itemMethods);

    angular.extend(EoeDataDemographic, modelMethods);


    return EoeDataDemographic;
  }
})();