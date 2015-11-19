(function () {
  'use strict';
  angular
    .module('applications')
    .factory('Application', Application);

  function Application($resource, $timeout, $q, $state, $stateParams, Upload, Messages) {
    var application = $resource('applications/:applicationId', {applicationId: '@_id'}, {
      update: {
        method: 'PUT'
      },
      manage: {
        method: 'PUT',
        url: 'applications/:applicationId/manage'
      },
      iAmReviewer: {
        method: 'GET',
        isArray: true,
        url: 'applications/iAmReviewer'
      },
      iAmPhoneInterviewer: {
        method: 'GET',
        isArray: true,
        url: 'applications/iAmPhoneInterviewer'
      },
      doReview: {
        method: 'GET',
        url: 'applications/:applicationId/conductReview'
      },
      saveReview: {
        method: 'POST',
        url: 'applications/:applicationId/saveReview/:reviewId',
        params: {
          reviewId: '@review._id'
        }
      },
      saveComment: {
        method: 'POST',
        url: 'applications/:applicationId/saveComment'
      },
      deleteComment: {
        method: 'POST',
        url: 'applications/:applicationId/deleteComment'
      },
      doPhoneInterview: {
        method: 'GET',
        url: 'applications/:applicationId/conductPhoneInterview'
      },
      savePhoneInterview: {
        method: 'POST',
        url: 'applications/:applicationId/savePhoneInterview/:phoneInterviewId',
        params: {
          phoneInterviewId: '@phoneInterview._id'
        }
      },
      createByUser: {
        method: 'POST',
        url: 'applications/createByUser'
      },
      create: {
        method: 'POST',
        url: 'applications/create'
      },
      checkForExistingUserApplication: {
        method: 'GET',
        url: 'applications/forOpeningForUser/:openingId'
      },
      checkForExistingEoe: {
        method: 'GET',
        url: 'applications/eoeProvided/:applicationId'
      },
      setEoeProvided: {
        method: 'PUT',
        url: '/applications/:applicationId/setEoeProvided'
      },
      removeFile: {
        method: 'PUT',
        url: 'applications/:applicationId/removeFile/:fileId',
        params: {
          applicationId: '@applicationId',
          fileId: '@fileId'
        }
      },
      forOpening: {
        method: 'GET',
        url: 'applications/forOpening/:openingId/:isActive',
        params: {
          openingId: '@openingId',
          isActive: '@isActive'
        },
        isArray: true
      },
      forApplicant: {
        method: 'GET',
        url: 'applications/forApplicant/:applicantId/:isActive',
        params: {
          applicantId: '@applicantId',
          isActive: '@isActive'
        },
        isArray: true
      },
      allOpen: {
        method: 'GET',
        url: 'applications/allOpen',
        isArray: true
      },
      allClosed: {
        method: 'GET',
        url: 'applications/allClosed',
        isArray: true
      },
      allReviewPhase: {
        method: 'GET',
        url: 'applications/allReviewPhase',
        isArray: true
      },
      allPhoneInterviewPhase: {
        method: 'GET',
        url: 'applications/allPhoneInterviewPhase',
        isArray: true
      },
      allOnSiteVisitPhase: {
        method: 'GET',
        url: 'applications/allOnSiteVisitPhase',
        isArray: true
      },
      allNotSubmitted: {
        method: 'GET',
        url: 'applications/allNotSubmitted',
        isArray: true
      },
      allSuccessful: {
        method: 'GET',
        url: 'applications/allSuccessful',
        isArray: true
      },
      successfulForOpening: {
        method: 'GET',
        url: 'applications/successfulForOpening/:openingId',
        params: {
          openingId: '@openingId'
        },
        isArray: true
      },
      countByDate: {
        method: 'GET',
        url: 'applications/countByDate/:dateStart/:dateEnd',
        params: {
          //position: '@position',
          dateStart: '@dateStart',
          dateEnd: '@dateEnd'
        }
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
      managerCreateApplication: function () {
        $state.go('main.managerCreateApplication');
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
      /**
       * @param {Application} applicationObject Named as such to avoid shadowing
       */
      manageApplication: function (applicationObject) {
        $state.go('main.manageApplication', {applicationId: applicationObject._id});
      },
      addReview: function addReview() {
        if (!this.reviewPhase.reviews) {
          this.reviewPhase.reviews = [];
        }
        if (this.reviewPhase.reviews.length < maxReviews) {
          this.reviewPhase.reviews.push(new Review());
        }
      },
      removeReview: function (review) {
        if (angular.isObject(review)) {
          this.reviewPhase.reviews.splice(this.reviewPhase.reviews.indexOf(review), 1);
        }
      },
      addPhoneInterview: function addPhoneInterview() {
        if (!this.phoneInterviewPhase.phoneInterviews) {
          this.phoneInterviewPhase.phoneInterviews = [];
        }
        if (this.phoneInterviewPhase.phoneInterviews.length < maxInterviews) {
          this.phoneInterviewPhase.phoneInterviews.push(new Interview());
        }
      },
      removePhoneInterview: function removePhoneInterview(phoneInterview) {
        if (angular.isObject(phoneInterview)) {
          this.phoneInterviewPhase.phoneInterviews.splice(this.phoneInterviewPhase.phoneInterviews.indexOf(phoneInterview), 1);
        }
      },
      showAddReviewButton: function showAddReviewButton() {
        return this.reviewPhase.reviews.length < maxReviews;
      },

      showAddPhoneInterviewButton: function showAddPhoneInterviewButton() {
        return this.phoneInterviewPhase.phoneInterviews.length < maxInterviews;
      },

      uploadFile: function (file, type, applicationId) {
        applicationId = applicationId || $stateParams.applicationId;
        var deferred = $q.defer();
        if (!file) {
          deferred.reject('no file given');
        } else {

          file.upload = Upload.upload({
            url: '/applications/' + applicationId + '/uploadFile/' + type,
            method: 'POST',
            data: {
              file: file
            }
          });
          file.upload.then(function (response) {
            $timeout(function () {
              deferred.resolve(response);
            });
          }, function (err) {
            if (err.status > 0) {
              Messages.addMessage(err.status + ': ' + err.data);
            }
          }, function (evt) {
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
          });
          return deferred.promise;
        }
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
          {
            title: 'Create a New Application',
            method: methods.managerCreateApplication,
            type: 'button',
            style: 'btn-add'
          },
          {title: 'View Application', method: methods.viewThisApplication, type: 'button', style: 'btn-view'},
          {title: 'Edit Application', method: methods.editThisApplication, type: 'button', style: 'btn-edit'}
        ];
        return angular.copy(modelActions);
      },
      conductReview: function (applicationObject) {
        $state.go('main.conductReview', {applicationId: applicationObject._id});
      },
      /**
       * @param {Application} applicationObject Named as such to avoid shadowing
       */
      conductPhoneInterview: function (applicationObject) {
        $state.go('main.conductPhoneInterview', {applicationId: applicationObject._id});
      },
      /**
       * @param {Application} applicationObject Named as such to avoid shadowing
       */
      viewApplication: function (applicationObject) {
        $state.go('main.viewApplication', {applicationId: applicationObject._id});
      },
      /**
       * @param {Object} applicationObject
       */
      manageApplication: function (applicationObject) {
        $state.go('main.manageApplication', {applicationId: applicationObject._id});
      }
    };

    angular.extend(application.prototype, itemMethods);
    angular.extend(application, modelMethods);
    return application;
  }
})();
