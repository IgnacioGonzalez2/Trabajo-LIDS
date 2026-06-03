//Funcionalidad 1: Capturar los datos de usuario y contraseña, guardarlos en el navegador y redirigir a la página principal.
//Primero asocio la app de AngularJS a mi página HTML (ver login.html)
var app = angular.module('miApp', []);

//Luego creo el controlador que se encargará de gestionar la lógica de mi página de login
app.controller('LoginController', function($scope) {
    
    // Indico donde se guardaran los datos del usuario y contraseña que el usuario introduzca en el formulario de login
    $scope.datos = {
        user: '',
        passwd: ''
    };

    //Finalemente creo la función que se ejecutará al hacer click en el botón de "Entrar" del formulario de login
    $scope.intentarEntrar = function() {
        
        //Guardo del sesion storage tanto el usuario como el token de la sesion
        sessionStorage.setItem("Usuario", $scope.datos.user);

        sessionStorage.setItem("token", "token_falso_de_prueba_12345");
        
        //Redirijo a la página principal  
        window.location.href = "index.html";
    };
});