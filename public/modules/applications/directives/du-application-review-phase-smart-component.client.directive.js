(function () {
  'use strict';

  angular
    .module('applications')
    .directive('duApplicationReviewPhaseSmartComponent', duApplicationReviewPhaseSmartComponent);

  /* @ngInject */
  function duApplicationReviewPhaseSmartComponent() {

    return {
      restrict: 'E',
      templateUrl: 'modules/applications/directives/partials/du-application-review-phase-smart-component.client.partial.html',
      controller: duApplicationReviewPhaseSmartComponentController,
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        reviewPhase: '='
      }
    };

    function duApplicationReviewPhaseSmartComponentController($scope, $stateParams, Users, Authentication, Messages, Application, _) {
      var vm = this;
      vm.addComment = addComment;
      vm.editComment = editComment;
      vm.editReview = editReview;
      vm.cancelCommentChanges = cancelCommentChanges;
      vm.cancelReviewChanges = cancelReviewChanges;
      vm.commentIsEditable = commentIsEditable;
      vm.deleteComment = deleteComment;
      vm.reviewIsCommentable = reviewIsCommentable;
      vm.reviewIsEditable = reviewIsEditable;
      vm.saveAndCompleteReview = saveAndCompleteReview;
      vm.saveComment = saveComment;
      vm.saveReview = saveReview;

      activate();

      function addComment(review) {

        function Comment(text) {
          this.comment = text || '';
          this.commenter = vm.user;
          this.editing = true;
          this.commentBuffer = text || '';
        }

        review.reviewWorksheet.comments.push(new Comment());

      }

      function editComment(comment) {
        comment.commentBuffer = angular.copy(comment.comment);
        comment.editing = true;
      }

      function editReview(review) {
        review.reviewWorksheet.bodyBuffer = angular.copy(review.reviewWorksheet.body);
        review.editing = true;
      }

      function cancelReviewChanges(review) {
        review.editing = false;

      }

      function cancelCommentChanges(review, comment) {
        if(!comment._id) {
          removeComment(review, comment);
        }
        comment.editing = false;
      }

      function deleteComment(review, comment) {
        if(comment._id) {
          var application = {
            _id: $stateParams.applicationId,
            review: review,
            comment: comment
          };

          Application.deleteComment(application).$promise
            .then(function(responseApplication){
              //_.forEach(responseApplication.reviewPhase.reviews, function(responseReview) {
              //  if(responseReview._id === review._id) {
              //    review = responseReview;
              //  }
              //});
              removeComment(review, comment);
              Messages.addMessage('Comment deleted');
            })
            .catch(function (err) {
              Messages.addMessage(err.data.message, 'error');
            });
        }
      }

      function removeComment(review, comment) {
        review.reviewWorksheet.comments.splice(review.reviewWorksheet.comments.indexOf(comment), 1);
      }

      function saveAndCompleteReview(review) {
        review.reviewWorksheet.complete = true;
        saveReview(review);
      }

      function saveComment(review, comment) {
        var application = {
          _id: $stateParams.applicationId,
          review: review,
          comment: comment
        };
        application.comment.comment = comment.commentBuffer;
        Application.saveComment(application).$promise
          .then(function(commentResponse){
            comment.editing = false;
            comment.comment = commentResponse.comment;
            comment.dateCreated = commentResponse.dateCreated;
            comment.dateUpdated = commentResponse.dateUpdated;
            comment._id = commentResponse._id;
            comment.commenter = commentResponse.commenter;
            Messages.addMessage('Comment Saved');

          })
          .catch(function (err) {
            Messages.addMessage(err.data.message, 'error');
          });
      }

      function saveReview(review) {
        var application = {
          _id: $stateParams.applicationId,
          review: _.clone(review)
        };
        application.review.reviewWorksheet.body = review.reviewWorksheet.bodyBuffer;
        application.review.reviewer = review.reviewer._id;
        Application.saveReview(application).$promise
          .then(function(updatedReview) {
            review.reviewWorksheet.dateCompleted = updatedReview.reviewWorksheet.dateCompleted;
            review.editing = false;
            Messages.addMessage('Review saved.');
          })
          .catch(function (err) {
            Messages.addMessage(err.data.message, 'error');
          });
      }

      function reviewIsCommentable(review) {
        return review.reviewWorksheet.complete;
      }

      function reviewIsEditable(review) {
        return vm.user.isMe(review.reviewer) && !review.reviewWorksheet.complete;
      }

      function commentIsEditable(review, comment) {
        return vm.user.isMe(comment.commenter) && review.reviewWorksheet.complete;
      }

      function activate() {

        Authentication.promise.then(function(user) {
          vm.user = user;
        });

      }
    }
  }
})();
