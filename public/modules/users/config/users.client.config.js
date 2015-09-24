(function () {
  'use strict';
  // Config HTTP Error Handling
  angular.module('users')
    .config(['$httpProvider',
      function ($httpProvider) {
        // Set the httpProvider "not authorized" interceptor
        $httpProvider.interceptors.push(['$q', '$location', 'Messages',
          function ($q, $location, Messages) {
            return {
              responseError: function (rejection) {
                switch (rejection.status) {
                  case 401:
                    // Redirect to signin page
                    $location.path('signin');
                    break;
                  case 403:
                    Messages.addMessage('You are not authorized to access the underlying data. Details: Url Requested: "' + rejection.config.url + '"" method: "' + rejection.config.method + '"', 'warn');
                    $location.path('home');

                    // Add unauthorized behaviour
                    break;
                }
                return $q.reject(rejection);
              }
            };
          }
        ]);
      }
    ])
    .run(['Menus',
      function (Menus) {
        // Set sidebar menu items
        Menus.addMenuItem('sidebar', 'Users', 'users', '#!/users/list', '#!/users/list', false, ['admin'], 100, 'users');
        //Menus.addMenuItem('sidebar', 'Add User', 'users/create', '#!/users/create', false, ['admin']);
      }]);

})();
