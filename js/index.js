var app = angular.module('miAppIndex', []);

app.controller('IndexController', function($scope) {
    //Funcionalidad 1: Comprobar que el usuario ha iniciado sesión antes de mostrar la página principal y posibilidad de cerrar sesión.

    //En primer lugar recupero el token de sesión guardado previamente al hacer login.
    let token = sessionStorage.getItem("token");

    if (token === null) {
        //Si no hay token redirigimos a la página de login.
        window.location.href = "login.html";
    } else {
        // Si hay token, recuperamos el nombre del usuario
        $scope.usuarioConectado = sessionStorage.getItem("Usuario") || "Administrador";
    }

    //Funcionalidad 2: Mostrar una lista de usuarios (con datos ficticios) y permitir eliminar usuarios de la lista.
    $scope.listaUsuarios = [
        { id: 1, name: "Nacho González", email: "nacho@uni.es" },
        { id: 2, name: "Jose Velasco", email: "jose@uni.es" },
        { id: 3, name: "Melon Mask", email: "melon@peta.com" }
    ];

    //Funcionalidad 3: Cerrar sesión.
    //Si se hace click en cerrar sesión se borran los datos del navegador y se redirige al login
    $scope.cerrarSesion = function() {
        sessionStorage.clear(); 
        window.location.href = "login.html"; 
    };

    //Funcionalidad 4: Eliminar usuario.
    $scope.borrarUsuario = function(idRecibido) {
        $scope.listaUsuarios = $scope.listaUsuarios.filter(u => u.id !== idRecibido);
    };

    // NUEVO: Objeto vacío para el formulario de la pantalla
    $scope.nuevoUsuario = {
        name: '',
        email: ''
    };

    //Funcionalidad 5: Añadir nuevo usuario
    $scope.crearUsuario = function() {
        //Compruebo que el usuario no haya dejado los campos vacíos
        if ($scope.nuevoUsuario.name === '' || $scope.nuevoUsuario.email === '') {
            alert("Por favor, rellena todos los campos.");
            return;
        }

        // Le invento un ID único sumando 1 al tamaño de la lista
        let nuevoId = $scope.listaUsuarios.length + 1;

        // Meto el nuevo usuario dentro de la lista de la memoria
        $scope.listaUsuarios.push({
            id: nuevoId,
            name: $scope.nuevoUsuario.name,
            email: $scope.nuevoUsuario.email
        });

        // Limpio los cuadros de texto de la pantalla para que queden vacíos otra vez
        $scope.nuevoUsuario.name = '';
        $scope.nuevoUsuario.email = '';

        alert("¡Usuario añadido con éxito!");
    };
});