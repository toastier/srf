'use strict';

module.exports = {
  db: 'mongodb://localhost/faculty-recruitment-system-dev',
  app: {
    title: 'Faculty Recruitment System - Development Environment'
  },
  saml: {
    path: '/auth/saml/callback',
    callbackURL: 'http://localhost:3000/auth/saml/callback'
  },
  assets: {
    lib: {
      css: [
        'public/lib/angular-ui-select/dist/select.css',
        'public/lib/angular-toastr/dist/angular-toastr.css'
      ],
      js: [
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-cookies/angular-cookies.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-touch/angular-touch.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-ui-select/dist/select.js',
        'public/lib/angular-toastr/dist/angular-toastr.tpls.js',
        'public/lib/lodash/lodash.js',
        'public/lib/ngSticky/lib/sticky.js',
        'public/lib/ng-currency/dist/ng-currency.js',
        'public/lib/ng-file-upload/ng-file-upload.js'
      ]
    },
    css: [
      'public/modules/core/css/*.css'
    ],
    js: [
      'public/config.js',
      'public/application.js',
      'public/modules/*/*.js',
      'public/modules/*/*[!tests]*/*.js'
    ],
    tests: [
      'public/lib/angular-mocks/angular-mocks.js',
      'public/modules/*/tests/*.js'
    ],
    jadeFiles: [
      'public/modules/*/views/*.client.view.jade',
      'public/modules/*/views/partials/*.client.partial.jade',
      'public/modules/*/directives/*.client.partial.jade',
      'public/modules/*/directives/partials/*.client.partial.jade'
    ]
  }
};