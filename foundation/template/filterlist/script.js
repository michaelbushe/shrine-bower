(function(angular){
    angular.module("filterTest", [])
        .controller("FilterTestCtrlr", function($scope){
            $scope.persons = [{type: 1, name: 'Caio'}, {type:2, name: 'Ary'}, {type:1, name: 'Camila'}];
        });
})(angular);
