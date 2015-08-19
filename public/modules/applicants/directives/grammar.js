//<ng-pluralize count="applicant.applicantPositions.length"
//              when="{'1': ' Position',
//						 '2': ' Positions'
//						 }">
//</ng-pluralize>


angular.module('core').directive('pluralize', function(schemaArrayElement) {
    var length = (schemaArrayElement.length);
    return {
        restrict: 'E',
        replace: true,
        template: '<ng-pluralize count=length when="{\'1\': \' Position\', \'2\': \' Positions\'}> </ng-pluralize>'
    }
})

// Experiment - not important - but wondering how to make a pluralize directive that would save code
//app.directive('pluralize, function factory() {
//    return {
//        var length = (schemaArrayElement.length);
//         return {
//            restrict: 'E',
//            replace: true,
//            template: '<ng-pluralize count=length when="{\'1\': \' Position\', \'2\': \' Positions\'}> </ng-pluralize>'
//         }
//        scope: {
//            control: '='
//        },
//        link      : function (scope, element, attrs) {
//            scope.internalControl = scope.control || {};
//            scope.internalControl.takenTablets = 0;
//            scope.internalControl.takeTablet = function() {
//                scope.internalControl.takenTablets += 1;
//            }
//        }
//    };
//});