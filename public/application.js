'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName)
  .config(['$compileProvider',
    function ($compileProvider) {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    }])
  .config(['$locationProvider',
    function ($locationProvider) {
      $locationProvider.hashPrefix('!');
    }
  ])
  .config(['datepickerConfig', 'datepickerPopupConfig',
    function (datepickerConfig, datepickerPopupConfig) {
      datepickerConfig.showWeeks = false;
      datepickerPopupConfig.datepickerPopup = 'MMM dd, yyyy';
    }
  ])
  .config(function (uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
  })
  .config(function (toastrConfig) {
    toastrConfig.timeOut = 1500;
    toastrConfig.positionClass = 'toast-top-right';
  })
  .config(['$provide', function ($provide) {
    $provide.decorator('taOptions', ['$delegate', function(taOptions) {
      taOptions.toolbar = [
        ['h1', 'h2', 'h3', 'h4', 'p', 'quote'],
        ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
        ['justifyLeft', 'justifyCenter', 'indent', 'outdent'],
        ['insertLink']
      ];
      return taOptions;
    }]);
  }]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_') window.location.hash = '#!';

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});