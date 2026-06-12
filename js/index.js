var app = angular.module('miAppIndex', []);

app.controller('IndexController', function ($scope, $http) {
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
    $scope.listaUsuarios = [];

    function cargarUsuarios() {
        $http.get('/users/' + token).then(function (respuesta) {
            if (respuesta.data && !respuesta.data.errormsg) {
                $scope.listaUsuarios = respuesta.data;
            }
        });
    }
    cargarUsuarios();

    //Funcionalidad 3: Cerrar sesión.
    //Si se hace click en cerrar sesión se borran los datos del navegador y se redirige al login
    $scope.cerrarSesion = function () {
        $http({
            method: 'PUT',
            url: '/logout',
            data: { session_id: token }
        }).then(function () {
            sessionStorage.clear();
            window.location.href = "login.html";
        });
    };

    //Funcionalidad 4: Eliminar usuario.
    $scope.borrarUsuario = function (idRecibido) {
        $http.delete('/user/' + token + '/' + idRecibido).then(function (respuesta) {
            if (!respuesta.data.errormsg) {
                $scope.listaUsuarios = $scope.listaUsuarios.filter(u => u.id !== idRecibido);
            }
        });
    };


    //Funcionalidad 5: Añadir nuevo usuario
    //Creo un objeto para almacenar los datos del nuevo usuario que se introduzcan en el formulario de añadir usuario.
    $scope.nuevoUsuario = {
        name: '',
        email: '',
        passwd: ''
    };

    $scope.crearUsuario = function () {
        //Compruebo que el usuario no haya dejado los campos vacíos
        if ($scope.nuevoUsuario.name === '' || $scope.nuevoUsuario.email === '' || $scope.nuevoUsuario.passwd === '') {
            alert("Por favor, rellena todos los campos.");
            return;
        }

        $http.post('/user', {
            session_id: token,
            name: $scope.nuevoUsuario.name,
            email: $scope.nuevoUsuario.email,
            passwd: $scope.nuevoUsuario.passwd
        }).then(function (respuesta) {
            if (!respuesta.data.errormsg) {
                cargarUsuarios();
                // Limpio los cuadros de texto de la pantalla para que queden vacíos otra vez
                $scope.nuevoUsuario.name = '';
                $scope.nuevoUsuario.email = '';
                $scope.nuevoUsuario.passwd = '';
                alert("¡Usuario añadido con éxito!");
            }
        });
    };

    // Funcionalidad 6: Lista de categorías de prueba
    $scope.listaCategorias = [];

    function cargarCategorias() {
        $http.get('/categories/' + token).then(function (respuesta) {
            if (respuesta.data && !respuesta.data.errormsg) {
                $scope.listaCategorias = respuesta.data;
            }
        });
    }
    cargarCategorias();

    // Funcionalidad 7: Eliminar categoría
    $scope.borrarCategoria = function (idRecibido) {
        $http.delete('/category/' + token + '/' + idRecibido).then(function (respuesta) {
            if (!respuesta.data.errormsg) {
                $scope.listaCategorias = $scope.listaCategorias.filter(c => c.id !== idRecibido);
                alert("Categoría eliminada");
            }
        });
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

        $http.post('/category', {
            session_id: token,
            name: $scope.nuevaCategoria.name
        }).then(function (respuesta) {
            if (!respuesta.data.errormsg) {
                cargarCategorias();
                $scope.nuevaCategoria.name = '';
                alert("¡Categoría añadida con éxito!");
            }
        });
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
    $scope.listaVideos = [];

    function cargarVideos() {
        $http.get('/videos/' + token).then(function (respuesta) {
            if (respuesta.data && !respuesta.data.errormsg) {
                $scope.listaVideos = respuesta.data;
            }
        });
    }
    cargarVideos();

    //Al crear un nuevo vídeo, se le asigna un ID único sumando 1 al tamaño de la lista, y se añade a la lista de vídeos.
    $scope.nuevoVideo = { titulo: '', url: '', categoria: '' };

    //Funcionalidad 12: Añadir nuevo vídeo
    //Al hacer click en el botón de añadir vídeo, compruebo que los campos no estén vacíos, añado el nuevo vídeo a la lista y limpio los campos del formulario.
    $scope.crearVideo = function () {
        if ($scope.nuevoVideo.titulo === '' || $scope.nuevoVideo.url === '' || $scope.nuevoVideo.categoria === '') {
            alert("Por favor, rellena con un título, URL del vídeo y una categoría valida.");
            return;
        }

        if (!$scope.nuevoVideo.categoria || !$scope.listaCategorias.some(function (categoria) {
            return categoria.name === $scope.nuevoVideo.categoria;
        })) {
            alert("Debes introducir una categoría valida");
            return;
        }

        $http.post('/video', {
            session_id: token,
            titulo: $scope.nuevoVideo.titulo,
            url: $scope.nuevoVideo.url,
            categoria: $scope.nuevoVideo.categoria
        }).then(function (respuesta) {
            if (!respuesta.data.errormsg) {
                cargarVideos();
                $scope.nuevoVideo.titulo = '';
                $scope.nuevoVideo.url = '';
                $scope.nuevoVideo.categoria = '';
                alert("¡Vídeo añadido con éxito!");
            }
        });
    };

    //Funcionalidad 13: Eliminar vídeo
    $scope.borrarVideo = function (idRecibido) {
        $http.delete('/video/' + token + '/' + idRecibido).then(function (respuesta) {
            if (!respuesta.data.errormsg) {
                $scope.listaVideos = $scope.listaVideos.filter(v => v.id !== idRecibido);
            }
        });
    };

    //Funcionalidad 14: Alternar visibilidad del formulario de añadir video
    $scope.mostrarFormularioVideo = false;

    $scope.alternarFormularioVideo = function () {
        $scope.mostrarFormularioVideo = !$scope.mostrarFormularioVideo;
    };

    //Funcionalidad 15: Modificar usuario existente
    $scope.modificarUsuario = function (usuario) {
        var nuevoNombre = prompt("Introduce el nuevo nombre:", usuario.name);
        var nuevoEmail = prompt("Introduce el nuevo correo electrónico:", usuario.email);
        var nuevaPasswd = prompt("Introduce la nueva contraseña:", "");
        
        if (!nuevoNombre || !nuevoEmail || !nuevaPasswd) return;

        $http.put('/user', {
            session_id: token,
            id: usuario.id,
            name: nuevoNombre,
            email: nuevoEmail,
            passwd: nuevaPasswd
        }).then(function (respuesta) {
            if (!respuesta.data.errormsg) {
                cargarUsuarios();
                alert("¡Usuario modificado con éxito!");
            }
        });
    };

    //Funcionalidad 16: Modificar categoría existente
    $scope.modificarCategoria = function (categoria) {
        var nuevoNombre = prompt("Introduce el nuevo nombre de la categoría:", categoria.name);
        
        if (!nuevoNombre) return;

        $http.put('/category', {
            session_id: token,
            id: categoria.id,
            name: nuevoNombre
        }).then(function (respuesta) {
            if (!respuesta.data.errormsg) {
                cargarCategorias();
                cargarVideos();
                alert("¡Categoría modificada con éxito!");
            }
        });
    };

    //Funcionalidad 17: Modificar vídeo existente
    $scope.modificarVideo = function (video) {
        var nuevoTitulo = prompt("Introduce el nuevo título del vídeo:", video.titulo);
        var nuevaUrl = prompt("Introduce la nueva URL del vídeo:", video.url);
        var nuevaCategoria = prompt("Introduce la nueva categoría del vídeo:", video.categoria);
        
        if (!nuevoTitulo || !nuevaUrl || !nuevaCategoria) return;

        $http.put('/video', {
            session_id: token,
            id: video.id,
            titulo: nuevoTitulo,
            url: nuevaUrl,
            categoria: nuevaCategoria
        }).then(function (respuesta) {
            if (!respuesta.data.errormsg) {
                cargarVideos();
                alert("¡Vídeo modificado con éxito!");
            }
        });
    };

});