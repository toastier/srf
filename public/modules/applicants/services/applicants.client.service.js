(function () {
  'use strict';
  angular
    .module('applicants')
    .factory('Applicant', Applicant);

  function Applicant($resource, $state, $stateParams) {
    var applicant = $resource('applicants/:applicantId', {applicantId: '@_id'}, {
      update: {
        method: 'PUT'
      }
    });

    /**
     * @param {Object} applicantData
     * @constructor
     */
    function ApplicantModel(applicantData) {
      applicantData = applicantData || {
          name: {}
        };

      this.name = {};
      this.name.firstName = applicantData.name.firstName;
      this.name.lastName = applicantData.name.lastName;
      this.name.middleName = applicantData.name.middleName;
      this.name.honorific = applicantData.name.honorific;
      this.name.suffix = applicantData.name.suffix;

    }

    /**
     * @param {Object} addressData
     * @constructor
     */
    function Address(addressData) {
      addressData = addressData || {};

      this.type = addressData.type;
      this.address1 = addressData.address1;
      this.address2 = addressData.address2;
      this.city = addressData.city;
      this.state = addressData.state;
      this.postalCode = addressData.postalCode;
      this.country = addressData.country;
      this.primary = !!addressData.primary;
    }

    /**
     * @param {Object} applicantPositionData
     * @constructor
     */
    function ApplicantPosition(applicantPositionData) {
      applicantPositionData = applicantPositionData || {
          institution: {}
        };
      applicantPositionData.institution = applicantPositionData.institution || {};

      this.positionName = applicantPositionData.positionName;
      this.dateExpectedCompletion = angular.isDate(applicantPositionData.dateExpectedCompletion) || null;
      this.note = applicantPositionData.note;
      this.institution = {};
      this.institution.institutionName = applicantPositionData.institution.institutionName;
      this.institution.city = applicantPositionData.institution.city;
      this.institution.state = applicantPositionData.institution.state;
      this.institution.country = applicantPositionData.institution.country;
    }

    /**
     * @param {Object} credentialData
     * @constructor
     */
    function Credential(credentialData) {
      credentialData = credentialData || {};

      this.credential = credentialData.credential;
      this.institution = credentialData.institution;
      this.year = credentialData.year;
      this.note = credentialData.note;

    }

    /**
     * @param {Object} emailAddressData
     * @constructor
     */
    function EmailAddress(emailAddressData) {
      emailAddressData = emailAddressData || {};
      this.emailAddress = emailAddressData.emailAddress;
      this.primary = !!emailAddressData.primary;
      this.note = emailAddressData.note;
    }

    /**
     * @param {Object} focalAreaData
     * @constructor
     */
    function FocalArea(focalAreaData) {
      focalAreaData = focalAreaData || {};

      this.focalArea = focalAreaData.focalArea;
    }

    /**
     * @param {Object} phoneNumberData
     * @constructor
     */
    function PhoneNumber(phoneNumberData) {
      phoneNumberData = phoneNumberData || {};
      this.phoneNumber = phoneNumberData.phoneNumber;
      this.type = phoneNumberData.type;
      this.note = phoneNumberData.note;
      this.primary = !!phoneNumberData.primary;
    }

    var methods = {
      editThisApplicant: function () {
        $state.go('main.editApplicant', {applicantId: $stateParams.applicantId});
      },
      viewThisApplicant: function () {
        $state.go('main.viewApplicant', {applicantId: $stateParams.applicantId});
      },
      createApplicant: function () {
        $state.go('main.createApplicant');
      }

    };

    var itemMethods = {

      editApplicant: function (applicant) {
        $state.go('main.editApplicant', {applicantId: applicant._id});
      },

      viewApplicant: function (applicant) {
        $state.go('main.viewApplicant', {applicantId: applicant._id});
      },

      addEmailAddress: function (emailAddressData) {
        if (!this.emailAddresses) {
          this.emailAddresses = [];
        }
        this.emailAddresses.push(new EmailAddress(emailAddressData));
      },

      removeEmailAddress: function (emailAddress) {
        this.emailAddresses.splice(this.emailAddresses.indexOf(emailAddress), 1);
      },

      addPhoneNumber: function (phoneNumberData) {
        if (!this.phoneNumbers) {
          this.phoneNumbers = [];
        }
        this.phoneNumbers.push(new PhoneNumber(phoneNumberData));
      },

      removePhoneNumber: function (phoneNumber) {
        this.phoneNumbers.splice(this.phoneNumbers.indexOf(phoneNumber), 1);
      },

      addCredential: function (credentialData) {
        if (!this.credentials) {
          this.credentials = [];
        }
        this.credentials.push(new Credential(credentialData));
      },

      removeCredential: function (credential) {
        this.credentials.splice(this.credentials.indexOf(credential), 1);
      },

      addAddress: function (addressData) {
        if (!this.addresses) {
          this.addresses = [];
        }
        this.addresses.push(new Address(addressData));
      },

      removeAddress: function (address) {
        this.addresses.splice(this.addresses.indexOf(address), 1);
      },

      addApplicantPosition: function (applicantPositionData) {
        if (!this.applicantPositions) {
          this.applicantPositions = [];
        }
        this.applicantPositions.push(new ApplicantPosition(applicantPositionData));
      },

      removeApplicantPosition: function (applicantPosition) {
        this.applicantPositions.splice(this.applicantPositions.indexOf(applicantPosition), 1);
      },

      addFocalArea: function (focalAreaData) {
        if (!this.focalAreas) {
          this.focalAreas = [];
        }
        this.focalAreas.push(new FocalArea(focalAreaData));
      },

      removeFocalArea: function (focalArea) {
        this.focalAreas.splice(this.focalAreas.indexOf(focalArea), 1);
      }
    };
    angular.extend(applicant.prototype, itemMethods);

    var modelMethods = {
      listApplicants: function () {
        $state.go('main.listApplicants');
      },
      getActions: function () {
        var modelActions = [
          {title: 'Create a New Applicant', method: methods.createApplicant, type: 'button', style: 'btn-add'},
          {title: 'View Applicant', method: methods.viewThisApplicant, type: 'button', style: 'btn-view'},
          {title: 'Edit Applicant', method: methods.editThisApplicant, type: 'button', style: 'btn-edit'}
        ];
        return angular.copy(modelActions);
      },
      getFocalAreaOptions: function () {
        var focalAreaOptions = [
          {focalArea: 'Acute / Critical Care'},
          {focalArea: 'Reproductive Health'},
          {focalArea: 'Pediatrics'},
          {focalArea: 'Oncology'},
          {focalArea: 'Geriatrics'},
          {focalArea: 'Informatics'}
        ];

        return angular.copy(focalAreaOptions);
      }
    };
    angular.extend(applicant, modelMethods);

    return applicant;
  }
})();
