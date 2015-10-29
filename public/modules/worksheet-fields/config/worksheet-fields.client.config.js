(function () {
  'use strict';
  angular.module('worksheetFields').run(['Menus',
    function (Menus) {
      Menus.addMenuItem('sidebar', 'Worksheet Setup', 'worksheetFields', null, '#!/worksheetFields', false, ['admin', 'manager'], 100, 'worksheet-fields');
    }
  ]);
})();
