var app = angular.module('miAppIndex', []);

app.controller('IndexController', function ($scope) {
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
    $scope.cerrarSesion = function () {
        sessionStorage.clear();
        window.location.href = "login.html";
    };

    //Funcionalidad 4: Eliminar usuario.
    $scope.borrarUsuario = function (idRecibido) {
        $scope.listaUsuarios = $scope.listaUsuarios.filter(u => u.id !== idRecibido);
    };


    //Funcionalidad 5: Añadir nuevo usuario
    //Creo un objeto para almacenar los datos del nuevo usuario que se introduzcan en el formulario de añadir usuario.
    $scope.nuevoUsuario = {
        name: '',
        email: ''
    };

    $scope.crearUsuario = function () {
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

    // Funcionalidad 6: Lista de categorías de prueba
    $scope.listaCategorias = [
        { id: 1, name: "Películas de Acción" },
        { id: 2, name: "Documentales de Ciencia" },
        { id: 3, name: "Series de Animación" }
    ];

    // Funcionalidad 7: Eliminar categoría
    $scope.borrarCategoria = function (idRecibido) {
        $scope.listaCategorias = $scope.listaCategorias.filter(c => c.id !== idRecibido);
        alert("Categoría eliminada");
    };

    //Funcionalidad 8: Añadir nueva categoría
    //Creo un objeto para almacenar los datos de la nueva categoría que se introduzcan en el formulario de añadir categoría.
    $scope.nuevaCategoria = {
        name: ''
    };
    
    $scope.crearCategoria = function () {
        if ($scope.nuevaCategoria.name === '') {
            alert("Por favor, rellena el nombre de la categoría.");
            return;
        }

        let nuevoIdCategoria = $scope.listaCategorias.length + 1;

        $scope.listaCategorias.push({
            id: nuevoIdCategoria,
            name: $scope.nuevaCategoria.name
        });

        $scope.nuevaCategoria.name = '';

        alert("¡Categoría añadida con éxito!");
    };

    //Funcionalidad 9: Alternar visibilidad del formulario de añadir usuario
    $scope.mostrarFormulario = false;

    $scope.abrirFormulario = function () {
        // Mantengo la función por compatibilidad; delega en alternarFormulario
        $scope.alternarFormulario();
    };

    //Compatibilidad: alterna la visibilidad del formulario de usuarios
    $scope.alternarFormulario = function () {
        $scope.mostrarFormulario = !$scope.mostrarFormulario;
    };

    //Funcionalidad 10: Alternar visibilidad del formulario de añadir categoría
    $scope.mostrarFormularioCategoria = false;

    $scope.alternarFormularioCategoria = function () {
        $scope.mostrarFormularioCategoria = !$scope.mostrarFormularioCategoria;
    };

    //Funcionalidad 11: Mostrar una lista de vídeos y permitir eliminar vídeos de la lista.
    //En primer lugar creo una lista de vídeos de prueba con título y URL.
    $scope.listaVideos = [
        { id: 1, titulo: "Tutorial Angular Básico", url: "https://example.com/angular", categoria: "Programación" },
        { id: 2, titulo: "Cómo usar SQLite", url: "https://example.com/sqlite", categoria: "Bases de Datos" }
    ];

    //Al crear un nuevo vídeo, se le asigna un ID único sumando 1 al tamaño de la lista, y se añade a la lista de vídeos.
    $scope.nuevoVideo = { titulo: '', url: '', categoria: '' };

    //Funcionalidad 12: Añadir nuevo vídeo
    //Al hacer click en el botón de añadir vídeo, compruebo que los campos no estén vacíos, añado el nuevo vídeo a la lista y limpio los campos del formulario.
    $scope.crearVideo = function () {
        if ($scope.nuevoVideo.titulo === '' || $scope.nuevoVideo.url === '') {
            alert("Por favor, rellena al menos el título y la URL del vídeo.");
            return;
        }

        $scope.listaVideos.push({
            id: $scope.listaVideos.length + 1,
            titulo: $scope.nuevoVideo.titulo,
            url: $scope.nuevoVideo.url,
            categoria: $scope.nuevoVideo.categoria || ''
        });

        $scope.nuevoVideo.titulo = '';
        $scope.nuevoVideo.url = '';
        $scope.nuevoVideo.categoria = '';
        alert("¡Vídeo añadido con éxito!");
    };

    //Funcionalidad 13: Eliminar vídeo
    $scope.borrarVideo = function (idRecibido) {
        $scope.listaVideos = $scope.listaVideos.filter(v => v.id !== idRecibido);
    };

    //Funcionalidad 14: Alternar visibilidad del formulario de añadir video
    $scope.mostrarFormularioVideo = false;

    $scope.alternarFormularioVideo = function () {
        $scope.mostrarFormularioVideo = !$scope.mostrarFormularioVideo;
    };

});