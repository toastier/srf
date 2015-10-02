(function () {
  'use strict';
  angular
    .module('applications')
    .factory('Application', Application);

  function Application($resource, $state, $stateParams) {
    var application = $resource('applications/:applicationId', {applicationId: '@_id'}, {
      update: {
        method: 'PUT'
      }
    });

    var maxReviews = 2;
    var maxInterviews = 2;

    function ReviewWorksheet() {
      this.complete = false;
      this.body = '';
      this.comments = [];
    }

    function Review() {
      this.reviewer = null;
      this.reviewWorksheet = new ReviewWorksheet();
    }
    
    function InterviewWorksheet() {
      this.complete = false;
      this.body = '';
      this.comments = [];
    }
    
    function Interview() {
      this.interviewer = null;
      this.interviewWorksheet = new InterviewWorksheet();
    }

    /**
     * Methods that are not returned directly, but used by other methods
     * @type {{editThisApplication: Function, viewThisApplication: Function, createApplication: Function}}
     */
    var methods = {
      editThisApplication: function () {
        $state.go('main.editApplication', {applicationId: $stateParams.applicationId});
      },
      viewThisApplication: function () {
        $state.go('main.viewApplication', {applicationId: $stateParams.applicationId});
      },
      createApplication: function () {
        $state.go('main.createApplication');
      }
    };
    
    /**
     * Methods to add to each result returned by $resource
     * @type {Object} itemMethods
     */
    var itemMethods = {
      /**
       * @param {Application} applicationObject Named as such to avoid shadowing
       */
      editApplication: function (applicationObject) {
        $state.go('main.editApplication', {applicationId: applicationObject._id});
      },
      /**
       * @param {Application} applicationObject Named as such to avoid shadowing
       */
      viewApplication: function (applicationObject) {
        $state.go('main.viewApplication', {applicationId: applicationObject._id});
      },
      addReview: function addReview() {
        if(!this.reviewPhase.reviews) {
          this.reviewPhase.reviews = [];
        }
        if(this.reviewPhase.reviews.length < maxReviews) {
          this.reviewPhase.reviews.push(new Review());
        }
      },
      removeReview: function (review) {
        if(angular.isObject(review)) {
          this.reviewPhase.reviews.splice(this.reviewPhase.reviews.indexOf(review), 1);
        }
      },
      addPhoneInterview: function addPhoneInterview() {
        if(!this.phoneInterviewPhase.interviews) {
          this.phoneInterviewPhase.interviews = [];
        }
        if(this.phoneInterviewPhase.interviews.length < maxInterviews) {
          this.phoneInterviewPhase.interviews.push(new Interview());
        }
      },
      showAddReviewButton: function showAddReviewButton () {
        return this.reviewPhase.reviews.length < maxReviews;
      },
      showAddPhoneInterviewButton: function showAddPhoneInterviewButton () {
        return this.phoneInterviewPhase.interviews.length < maxInterviews;
      }
    };

    /**
     * Methods to add to the Model
     * @type {Object} modelMethods
     */
    var modelMethods = {
      listApplications: function () {
        $state.go('main.listApplications');
      },
      getActions: function () {
        var modelActions = [
          {title: 'Create a New Application', method: methods.createApplication, type: 'button', style: 'btn-add'},
          {title: 'View Application', method: methods.viewThisApplication, type: 'button', style: 'btn-view'},
          {title: 'Edit Application', method: methods.editThisApplication, type: 'button', style: 'btn-edit'}
        ];
        return angular.copy(modelActions);
      }
    };
    
    angular.extend(application.prototype, itemMethods);
    angular.extend(application, modelMethods);
    return application;
  }
})();
