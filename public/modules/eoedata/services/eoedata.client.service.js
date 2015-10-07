(function () {
  'use strict';
  angular
    .module('eoeDatademographic')
    .factory('EoeDatademographic', EoeDatademographic);

  function EoeDatademographic($resource, $state, $stateParams) {
    var EoeDatademographic = $resource('eoeDatademographic/:eoeDatademographicId', {eoeDatademographicId: '@_id'}, {
      update: {
        method: 'PUT'
      }
    });

    var methods = {
      editThisEoeDatademographic: function () {
        $state.go('main.editEoeDatademographic', {eoeDatademographicId: $stateParams.eoeDatademographicId});
      },
      viewThisEoeDatademographic: function () {
        $state.go('main.viewEoeDatademographic', {eoeDatademographicId: $stateParams.eoeDatademographicId});
      },
      createEoeDatademographic: function () {
        $state.go('main.createEoeDatademographic');
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
      editEoeDatademographic: function (eoeDatademographic) {
        $state.go('main.editEoeDatademographic', {eoeDatademographicId: eoeDatademographic._id});
      },
      removePostingLink: function (postingLinkItem) {
        var index = this.postingLink.indexOf(postingLinkItem);
        this.postingLink.splice(index, 1);
      },
      viewEoeDatademographic: function (eoeDatademographic) {
        $state.go('main.viewEoeDatademographic', {eoeDatademographicId: eoeDatademographic._id});
      }
    };

    /**
     * Methods to add to the Model
     * @type {{listEoeDatademographic: Function, getActions: Function}}
     */
    var modelMethods = {

      listEoeDatademographic: function () {
        $state.go('main.listEoeDatademographic');
      },
      getActions: function () {
        var modelActions = [
          {title: 'Create a New EoeDatademographic', method: methods.createEoeDatademographic, type: 'button', style: 'btn-add'},
          {title: 'View EoeDatademographic', method: methods.viewThisEoeDatademographic, type: 'button', style: 'btn-view'},
          {title: 'Edit EoeDatademographic', method: methods.editThisEoeDatademographic, type: 'button', style: 'btn-edit'}
        ];
        return angular.copy(modelActions);
      }
    };

    /**
     * Extend EoeDatademographic with the methods
     */
    angular.extend(EoeDatademographic.prototype, itemMethods);

    angular.extend(EoeDatademographic, modelMethods);


    return EoeDatademographic;
  }
})();