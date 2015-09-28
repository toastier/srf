(function () {
  'use strict';
  angular
    .module('openings')
    .factory('Opening', Opening);

  function Opening($resource, $state, $stateParams) {
    var Opening = $resource('openings/:openingId', {openingId: '@_id'}, {
      update: {
        method: 'PUT'
      }
    });

    var methods = {
      editThisOpening: function () {
        $state.go('editOpening', {openingId: $stateParams.openingId});
      },
      viewThisOpening: function () {
        $state.go('viewOpening', {openingId: $stateParams.openingId});
      },
      createOpening: function () {
        $state.go('createOpening');
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
      editOpening: function (opening) {
        $state.go('editOpening', {openingId: opening._id});
      },
      removePostingLink: function (postingLinkItem) {
        var index = this.postingLink.indexOf(postingLinkItem);
        this.postingLink.splice(index, 1);
      },
      viewOpening: function (opening) {
        $state.go('viewOpening', {openingId: opening._id});
      }
    };

    var modelMethods = {

      listOpenings: function () {
        $state.go('listOpenings');
      },
      getActions: function () {
        var modelActions = [
          {title: 'Create a New Opening', method: methods.createOpening, type: 'button', style: 'btn-add'},
          {title: 'View Opening', method: methods.viewThisOpening, type: 'button', style: 'btn-view'},
          {title: 'Edit Opening', method: methods.editThisOpening, type: 'button', style: 'btn-edit'}
        ];
        return angular.copy(modelActions);
      }
    };

    /**
     * Extend Opening with the methods
     */
    angular.extend(Opening.prototype, itemMethods);

    angular.extend(Opening, modelMethods);


    return Opening;
  }
})();