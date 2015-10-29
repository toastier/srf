(function () {
  'use strict';
  angular
    .module('applications')
    .provider('PhoneInterviewPhase', PhoneInterviewPhase);

  function PhoneInterviewPhase () {
    this.$get = providerGetFunction;

    function providerGetFunction ($stateParams, Application, Messages, _ ) {

      var PhoneInterviewPhaseModel = function PhoneInterviewPhaseModel (phoneInterviewPhaseData, proceed, user) {

        var phoneInterviewPhase = this;

        phoneInterviewPhase.data = phoneInterviewPhaseData;
        phoneInterviewPhase.user = user;
        phoneInterviewPhase.proceedToPhoneInterviewPhase = proceed;

        phoneInterviewPhase.addComment = addComment;
        phoneInterviewPhase.editComment = editComment;
        phoneInterviewPhase.editPhoneInterview = editPhoneInterview;
        phoneInterviewPhase.cancelPhoneInterviewChanges = cancelPhoneInterviewChanges;
        phoneInterviewPhase.cancelCommentChanges = cancelCommentChanges;
        phoneInterviewPhase.commentIsEditable = commentIsEditable;
        phoneInterviewPhase.deleteComment = deleteComment;
        phoneInterviewPhase.getPhoneInterviewPhaseStatus = getPhoneInterviewPhaseStatus;
        phoneInterviewPhase.phoneInterviewIsEditable = phoneInterviewIsEditable;
        phoneInterviewPhase.phoneInterviewIsCommentable = phoneInterviewIsCommentable;
        phoneInterviewPhase.phoneInterviewPhaseStatus = '';
        phoneInterviewPhase.saveAndCompletePhoneInterview = saveAndCompletePhoneInterview;
        phoneInterviewPhase.saveComment = saveComment;
        phoneInterviewPhase.savePhoneInterview = savePhoneInterview;
        phoneInterviewPhase.setPhoneInterviewPhaseStatus = setPhoneInterviewPhaseStatus;

        activate();

        function activate() {
          setPhoneInterviewPhaseStatus();
        }

        function addComment(phoneInterview) {
          phoneInterview.phoneInterviewWorksheet.comments.push(new Comment());
        }

        function editComment(comment) {
          comment.commentBuffer = angular.copy(comment.comment);
          comment.editing = true;
        }

        function editPhoneInterview(phoneInterview) {
          phoneInterview.phoneInterviewWorksheet.bodyBuffer = angular.copy(phoneInterview.phoneInterviewWorksheet.body);
          phoneInterview.editing = true;
        }

        function cancelPhoneInterviewChanges(phoneInterview) {
          phoneInterview.editing = false;
        }

        function cancelCommentChanges(phoneInterview, comment) {
          if(!comment._id) {
            removeComment(phoneInterview, comment);
          }
          comment.editing = false;
        }

        function Comment(text) {
          this.comment = text || '';
          this.commenter = phoneInterviewPhase.user;
          this.editing = true;
          this.commentBuffer = text || '';
        }

        function commentIsEditable(phoneInterview, comment) {
          return phoneInterviewPhase.user.isMe(comment.commenter) && !phoneInterviewIsEditable(phoneInterview) && phoneInterviewPhaseIsOpen();
        }

        function deleteComment(phoneInterview, comment) {
          if(comment._id) {
            var application = {
              _id: $stateParams.applicationId,
              phoneInterview: phoneInterview,
              comment: comment
            };

            Application.deleteComment(application).$promise
              .then(function(){
                removeComment(phoneInterview, comment);
                Messages.addMessage('Comment deleted');
              })
              .catch(function (err) {
                Messages.addMessage(err.data.message, 'error');
              });
          }
        }

        function getPhoneInterviewPhaseStatus() {
          if(phoneInterviewPhaseIsComplete()) {
            return 'Complete';
          }
          if(!phoneInterviewPhaseIsOpen()) {
            return 'Closed';
          }
          if(phoneInterviewPhaseIsOpen()) {
            return 'Open';
          }
        }

        function proceedToPhoneInterviewPhase() {
          return (phoneInterviewPhase.proceedToPhoneInterviewPhase === 'true');
        }

        function phoneInterviewPhaseIsComplete () {
          return (phoneInterviewPhase.data.proceedToOnSite === true || phoneInterviewPhase.data.proceedToOnSite === false);
        }

        function phoneInterviewPhaseIsOpen () {
          return proceedToPhoneInterviewPhase() && !phoneInterviewPhaseIsComplete();
        }

        function phoneInterviewIsComplete(phoneInterview) {
          return !!phoneInterview.phoneInterviewWorksheet.complete;
        }

        function phoneInterviewIsCommentable(phoneInterview) {
          return !phoneInterviewIsEditable(phoneInterview) && phoneInterviewPhaseIsOpen() && phoneInterviewIsComplete(phoneInterview);
        }

        function phoneInterviewIsEditable(phoneInterview) {
          return phoneInterviewPhase.user.isMe(phoneInterview.interviewer) && phoneInterviewPhaseIsOpen() && !phoneInterviewIsComplete(phoneInterview);
        }

        function removeComment(phoneInterview, comment) {
          phoneInterview.phoneInterviewWorksheet.comments.splice(phoneInterview.phoneInterviewWorksheet.comments.indexOf(comment), 1);
        }

        function saveAndCompletePhoneInterview(phoneInterview) {
          phoneInterview.phoneInterviewWorksheet.complete = true;
          savePhoneInterview(phoneInterview);
        }

        function saveComment(phoneInterview, comment) {
          var application = {
            _id: $stateParams.applicationId,
            phoneInterview: phoneInterview,
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

        function savePhoneInterview(phoneInterview) {
          var application = {
            _id: $stateParams.applicationId,
            phoneInterview: _.clone(phoneInterview)
          };
          application.phoneInterview.phoneInterviewWorksheet.body = phoneInterview.phoneInterviewWorksheet.bodyBuffer;
          application.phoneInterview.interviewer = phoneInterview.interviewer._id;
          Application.savePhoneInterview(application).$promise
            .then(function(updatedPhoneInterview) {
              phoneInterview.phoneInterviewWorksheet.dateCompleted = updatedPhoneInterview.phoneInterviewWorksheet.dateCompleted;
              phoneInterview.editing = false;
              Messages.addMessage('PhoneInterview saved.');
            })
            .catch(function (err) {
              Messages.addMessage(err.data.message, 'error');
            });
        }

        function setPhoneInterviewPhaseStatus() {
          phoneInterviewPhase.phoneInterviewPhaseStatus = getPhoneInterviewPhaseStatus();
        }

      };

      return PhoneInterviewPhaseModel;

    }
  }
})();
