//Funcionalidad 1: Capturar los datos de usuario y contraseña, guardarlos en el navegador y redirigir a la página principal.
//Primero asocio la app de AngularJS a mi página HTML (ver login.html)
var app = angular.module('miApp', []);

//Luego creo el controlador que se encargará de gestionar la lógica de mi página de login
app.controller('LoginController', function ($scope, $http) {

    // Indico donde se guardaran los datos del usuario y contraseña que el usuario introduzca en el formulario de login
    $scope.datos = {
        user: '',
        passwd: ''
    };

    //Finalemente creo la función que se ejecutará al hacer click en el botón de "Entrar" del formulario de login
    $scope.intentarEntrar = function () {

        // Hago una petición POST real a la ruta '/login' de tu servidor local
        $http.post('/login', $scope.datos)
            .then(function (respuesta) {
                // Si el servidor confirma, nos devuelve el token y el id del usuario
                console.log("El servidor responde:", respuesta.data);

                if (respuesta.data && respuesta.data.session_id) {
                    // Guardo los datos reales en la memoria del navegador
                    sessionStorage.setItem("token", respuesta.data.session_id);
                    sessionStorage.setItem("Usuario", $scope.datos.user);
                    sessionStorage.setItem("Id_usuario", respuesta.data.session_id);

                    //Redirijo a la página principal  
                    window.location.href = "index.html";
                } else {
                    alert("El usuario o la contraseña no son correctos.");
                }
            })

            .catch(function (error) {
                // Si las credenciales están mal o el usuario no existe, el servidor escupirá un error
                console.error("Error en el inicio de sesión:", error);
                alert("El usuario o la contraseña no son correctos.");
            });
    };
});