(function () {
  'use strict';
  angular
    .module('eoeDataDemographics')
    .factory('EoeDataDemographics', EoeDataDemographics);

  function EoeDataDemographics($resource, $state, $stateParams) {
    var EoeDataDemographics = $resource('eoeDataDemographics/:eoeDataDemographicsId', {eoeDataDemographicsId: '@_id'}, {
      update: {
        method: 'PUT'
      }
    });

    var methods = {
      editThisEoeDataDemographics: function () {
        $state.go('main.editEoeDataDemographics', {eoeDataDemographicsId: $stateParams.eoeDataDemographicsId});
      },
      viewThisEoeDataDemographics: function () {
        $state.go('main.viewEoeDataDemographics', {eoeDataDemographicsId: $stateParams.eoeDataDemographicsId});
      },
      createEoeDataDemographics: function () {
        $state.go('main.createEoeDataDemographics');
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
      editEoeDataDemographics: function (eoeDataDemographics) {
        $state.go('main.editEoeDataDemographics', {eoeDataDemographicsId: eoeDataDemographics._id});
      },
      removePostingLink: function (postingLinkItem) {
        var index = this.postingLink.indexOf(postingLinkItem);
        this.postingLink.splice(index, 1);
      },
      viewEoeDataDemographics: function (eoeDataDemographics) {
        $state.go('main.viewEoeDataDemographics', {eoeDataDemographicsId: eoeDataDemographics._id});
      }
    };

    /**
     * Methods to add to the Model
     * @type {{listEoeDataDemographics: Function, getActions: Function}}
     */
    var modelMethods = {

      listEoeDataDemographics: function () {
        $state.go('main.listEoeDataDemographics');
      },
      getActions: function () {
        var modelActions = [
          {title: 'Create a New EoeDataDemographics', method: methods.createEoeDataDemographics, type: 'button', style: 'btn-add'},
          {title: 'View EoeDataDemographics', method: methods.viewThisEoeDataDemographics, type: 'button', style: 'btn-view'},
          {title: 'Edit EoeDataDemographics', method: methods.editThisEoeDataDemographics, type: 'button', style: 'btn-edit'}
        ];
        return angular.copy(modelActions);
      }
    };

    /**
     * Extend EoeDataDemographics with the methods
     */
    angular.extend(EoeDataDemographics.prototype, itemMethods);

    angular.extend(EoeDataDemographics, modelMethods);


    return EoeDataDemographics;
  }
})();