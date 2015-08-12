'use strict';

angular.module('core').controller('SidebarController', ['$scope', 'Authentication', 'Menus',
    function($scope, Authentication, Menus) {
        var sidebar = this;
        sidebar.authentication = Authentication;
        sidebar.menus = Menus;
        sidebar.menu = Menus.getMenu('sidebar');
        //$scope.authentication = Authentication;
        $scope.isCollapsed = false;

        $scope.toggleCollapsibleMenu = function() {
            $scope.isCollapsed = !$scope.isCollapsed;
        };
    }
]);