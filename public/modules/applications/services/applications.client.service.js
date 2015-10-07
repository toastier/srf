(function () {
  'use strict';
  angular
    .module('applications')
    .factory('Application', Application);

  function Application($resource, $timeout, $q, $state, $stateParams, Upload, Messages) {
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
      /**
       * @param {Application} applicationObject Named as such to avoid shadowing
       */
      manageApplication: function (applicationObject) {
        $state.go('main.manageApplication', {applicationId: applicationObject._id});
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
        if(!this.phoneInterviewPhase.phoneInterviews) {
          this.phoneInterviewPhase.phoneInterviews = [];
        }
        if(this.phoneInterviewPhase.phoneInterviews.length < maxInterviews) {
          this.phoneInterviewPhase.phoneInterviews.push(new Interview());
        }
      },
      removePhoneInterview: function removePhoneInterview(phoneInterview) {
        if(angular.isObject(phoneInterview)) {
          this.phoneInterviewPhase.phoneInterviews.splice(this.phoneInterviewPhase.phoneInterviews.indexOf(phoneInterview), 1);
        }
      },
      showAddReviewButton: function showAddReviewButton () {
        return this.reviewPhase.reviews.length < maxReviews;
      },

      showAddPhoneInterviewButton: function showAddPhoneInterviewButton () {
        return this.phoneInterviewPhase.phoneInterviews.length < maxInterviews;
      },

      uploadCv: function() {
        var deferred = $q.defer();
        var cv = this.cv;

        cv.upload = Upload.upload({
          url: '/uploads/cv',
          method: 'POST',
          data: {
            type: 'cv',
            file: cv
          }
        });
        cv.upload.then(function (response) {
          $timeout(function () {
            deferred.resolve(response);
            //cv.result = response.data;
          });
        }, function(err) {
          if(err.status > 0) {
            Messages.addMessage(err.status + ': ' + err.data);
          }
        }, function(evt) {
          cv.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
        return deferred.promise;
      },

      uploadCoverletter: function() {
        var deferred = $q.defer();
        var coverLetter = this.coverLetter;

        coverLetter.upload = Upload.upload({
          url: '/uploads/coverLetter',
          method: 'POST',
          data: {
            type: 'coverLetter',
            file: coverletter
          }
        });

        coverLetter.upload.then(function (response) {
          $timeout(function () {
            deferred.resolve(response);
            //coverLetter.result = response.data;
          });
        }, function(err) {
          if(err.status > 0) {
            Messages.addMessage(err.status + ': ' + err.data);
          }
        }, function(evt) {
          coverLetter.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
        return deferred.promise;
      },

      createApplication: function() {
        var deferred = $q.defer();
        this.files = [];
        var files = this.files;

        //add the cv if it has been provided
        if (angular.isObject(this.cv)) {
          files.push(this.cv);
        }

        //add the coverLetter if it has been provided
        if (angular.isObject(this.coverLetter)) {
          files.push(this.coverLetter);
        }

        files.upload = Upload.upload({
          url: '/uploads/newApplication',
          method: 'POST',
          data: {
            //this shows up in the fields object when parsing the multi-part form
            type: 'bundle',
            files: files
          }
        });

        files.upload.then(function (response) {
          $timeout(function() {
            deferred.resolve(response);
          });
        }, function(err) {
          if(err.status > 0) {
            Messages.addMessage(err.status + ': ' + err.data.message);
          }
        }, function (evt) {
          files.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
        return deferred.promise;
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
