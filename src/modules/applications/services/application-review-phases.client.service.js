(function () {
  'use strict';
  angular
    .module('applications')
    .provider('ReviewPhase', ReviewPhase);

  function ReviewPhase() {
    this.$get = providerGetFunction;

    function providerGetFunction($stateParams, Application, Messages, _) {

      var ReviewPhaseModel = function ReviewPhaseModel(reviewPhaseData, proceed, user) {

        var reviewPhase = this;

        reviewPhase.data = reviewPhaseData;
        reviewPhase.user = user;
        reviewPhase.proceedToReviewPhase = proceed;

        reviewPhase.addComment = addComment;
        reviewPhase.editComment = editComment;
        reviewPhase.editReview = editReview;
        reviewPhase.cancelReviewChanges = cancelReviewChanges;
        reviewPhase.cancelCommentChanges = cancelCommentChanges;
        reviewPhase.commentIsEditable = commentIsEditable;
        reviewPhase.deleteComment = deleteComment;
        reviewPhase.getReviewPhaseStatus = getReviewPhaseStatus;
        reviewPhase.reviewIsEditable = reviewIsEditable;
        reviewPhase.reviewIsCommentable = reviewIsCommentable;
        reviewPhase.reviewPhaseStatus = '';
        reviewPhase.saveAndCompleteReview = saveAndCompleteReview;
        reviewPhase.saveComment = saveComment;
        reviewPhase.saveReview = saveReview;
        reviewPhase.setReviewPhaseStatus = setReviewPhaseStatus;

        activate();

        function activate() {
          setReviewPhaseStatus();
        }

        function addComment(review) {
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
          if (!comment._id) {
            removeComment(review, comment);
          }
          comment.editing = false;
        }

        function Comment(text) {
          this.comment = text || '';
          this.commenter = reviewPhase.user;
          this.editing = true;
          this.commentBuffer = text || '';
        }

        function commentIsEditable(review, comment) {
          return reviewPhase.user.isMe(comment.commenter) && !reviewIsEditable(review) && reviewPhaseIsOpen();
        }

        function deleteComment(review, comment) {
          if (comment._id) {
            var application = {
              _id: $stateParams.applicationId,
              review: review,
              comment: comment
            };

            Application.deleteComment(application).$promise
              .then(function () {
                removeComment(review, comment);
                Messages.addMessage('Comment deleted');
              })
              .catch(function (err) {
                Messages.addMessage(err.data.message, 'error');
              });
          }
        }

        function getReviewPhaseStatus() {
          if (reviewPhaseIsComplete()) {
            return 'Complete';
          }
          if (!reviewPhaseIsOpen()) {
            return 'Closed';
          }
          if (reviewPhaseIsOpen()) {
            return 'Open';
          }
        }

        function proceedToReviewPhase() {
          return (reviewPhase.proceedToReviewPhase === 'true');
        }

        function reviewPhaseIsComplete() {
          return (reviewPhase.data.proceedToPhoneInterview === true || reviewPhase.data.proceedToPhoneInterview === false);
        }

        function reviewPhaseIsOpen() {
          return proceedToReviewPhase() && !reviewPhaseIsComplete();
        }

        function reviewIsComplete(review) {
          return !!review.reviewWorksheet.complete;
        }

        function reviewIsCommentable(review) {
          return !reviewIsEditable(review) && reviewPhaseIsOpen() && reviewIsComplete(review);
        }

        function reviewIsEditable(review) {
          return reviewPhase.user.isMe(review.reviewer) && reviewPhaseIsOpen() && !reviewIsComplete(review);
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
            .then(function (commentResponse) {
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
            .then(function (updatedReview) {
              review.reviewWorksheet.dateCompleted = updatedReview.reviewWorksheet.dateCompleted;
              review.editing = false;
              Messages.addMessage('Review saved.');
            })
            .catch(function (err) {
              Messages.addMessage(err.data.message, 'error');
            });
        }

        function setReviewPhaseStatus() {
          reviewPhase.reviewPhaseStatus = getReviewPhaseStatus();
        }

      };

      return ReviewPhaseModel;

    }
  }
})();
