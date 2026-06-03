var app = angular.module('miApp', []);

app.controller('LoginController', function($scope) {
    $scope.datos = {
        user: '',
        passwd: ''
    };

    $scope.intentarEntrar = function() {
        alert("Hola");
    };
});