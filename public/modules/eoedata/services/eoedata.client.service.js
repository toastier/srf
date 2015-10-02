(function () {
  'use strict';
  angular
    .module('eoedata')
    .factory('Eoedata', Eoedata);

  function Eoedata($resource, $state, $stateParams) {
    var Eoedata = $resource('eoedata/:eoedataId', {eoedataId: '@_id'}, {
      update: {
        method: 'PUT'
      }
    });

    var methods = {
      editThisEoedata: function () {
        $state.go('main.editEoedata', {eoedataId: $stateParams.eoedataId});
      },
      viewThisEoedata: function () {
        $state.go('main.viewEoedata', {eoedataId: $stateParams.eoedataId});
      },
      createEoedata: function () {
        $state.go('main.createEoedata');
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
      editEoedata: function (eoedata) {
        $state.go('main.editEoedata', {eoedataId: eoedata._id});
      },
      removePostingLink: function (postingLinkItem) {
        var index = this.postingLink.indexOf(postingLinkItem);
        this.postingLink.splice(index, 1);
      },
      viewEoedata: function (eoedata) {
        $state.go('main.viewEoedata', {eoedataId: eoedata._id});
      }
    };

    /**
     * Methods to add to the Model
     * @type {{listEoedata: Function, getActions: Function}}
     */
    var modelMethods = {

      listEoedata: function () {
        $state.go('main.listEoedata');
      },
      getActions: function () {
        var modelActions = [
          {title: 'Create a New Eoedata', method: methods.createEoedata, type: 'button', style: 'btn-add'},
          {title: 'View Eoedata', method: methods.viewThisEoedata, type: 'button', style: 'btn-view'},
          {title: 'Edit Eoedata', method: methods.editThisEoedata, type: 'button', style: 'btn-edit'}
        ];
        return angular.copy(modelActions);
      }
    };

    /**
     * Extend Eoedata with the methods
     */
    angular.extend(Eoedata.prototype, itemMethods);

    angular.extend(Eoedata, modelMethods);


    return Eoedata;
  }
})();