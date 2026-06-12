'use strict';

// Cargamos el modulo de Express
const express = require('express');

// Crearmos un objeto servidor HTTP
const server = express();

// definimos el puerto a usar por el servidor HTTP
const port = 8080;

const crypto = require('crypto');

// Obtener la referencia al módulo 'body-parser'
const bodyParser = require('body-parser');

// Configuring express to use body-parser as middle-ware.
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// Obtener el configurador de rutas
const router = express.Router();

// cargar el módulo para bases de datos SQLite
var sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Abrir nuestra base de datos
var db = new sqlite3.Database(
    path.join(__dirname, 'multimedia.db'),    // nombre del fichero de base de datos
    (err) => { // funcion que será invocada con el resultado
        if (err)      // Si ha ocurrido un error
            console.log(err);  // Mostrarlo por la consola del servidor
    }
);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
        login TEXT NOT NULL, 
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        passwd TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
        name TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
        titulo TEXT NOT NULL,
        url TEXT NOT NULL,
        categoria TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS active_sessions (
        session_id TEXT PRIMARY KEY,
        user_id INTEGER
    )`);

    db.run("UPDATE users SET login='admin', name='Administrador', email='admin@mycompany.com', passwd='admin' WHERE id=1");

    db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
        if (row && row.count === 0) {
            db.run("INSERT INTO users (login, name, email, passwd) VALUES ('admin', 'Administrador', 'admin@mycompany.com', 'admin')");
        }
    });
});

function verificarSesion(session_id, callback) {
    db.get('SELECT user_id FROM active_sessions WHERE session_id=?', session_id, (err, row) => {
        callback(row != undefined);
    });
}

function processLogin(req, res, db) {
    var login = req.body.user;
    var passwd = req.body.passwd;

    db.get(
        // consulta y parámetros cuyo valor será usado en los '?'
        'SELECT * FROM users WHERE login=?', login,
        // funcion que se invocará con los datos obtenidos de la base de datos
        (err, row) => {
            if (row == undefined) {
                // La consulta no devuelve ningun dato -: no existe el usuario
                res.json({ errormsg: 'El usuario no existe'});
            } else if (row.passwd === passwd) {
                // La contraseña es correcta
                // Asociar el userID a los datos de la sesión
                const token = crypto.randomUUID();
                db.run('INSERT INTO active_sessions (session_id, user_id) VALUES (?, ?)', [token, row.id], () => {
                    // enviar en la respuesta serializado en formato JSON
                    res.json({ session_id: token });
                });
            } else {
                // La contraseña no es correcta, -: enviar este otro mensaje
                res.json({ errormsg: 'Fallo de autenticación'});
            }
        }
    );
}

function processLogout(req, res, db) {
    var session_id = req.body.session_id;
    db.run('DELETE FROM active_sessions WHERE session_id=?', session_id, () => {
        res.json({ message: 'Sesión finalizada con éxito' });
    });
}

function processListarUsuarios(req, res, db) {
    db.all(
        // consulta y parámetros cuyo valor será usado en los '?'
        'SELECT id, name, email FROM users', [],
        // funcion que se invocará con los datos obtenidos de la base de datos
        (err, rows) => {
            // enviar en la respuesta serializado en formato JSON
            res.json(rows);
        }
    );
}

function processCrearUsuario(req, res, db) {
    var name = req.body.name;
    var email = req.body.email;
    var passwd = req.body.passwd;
    db.run('INSERT INTO users (login, name, email, passwd) VALUES (?, ?, ?, ?)', [name, name, email, passwd], function() {
        res.json({ id: this.lastID, name: name, email: email });
    });
}

function processBorrarUsuario(req, res, db) {
    var id = req.params.id;
    db.run('DELETE FROM users WHERE id=?', id, () => {
        res.json({ message: 'Usuario eliminado' });
    });
}

function processModificarUsuario(req, res, db) {
    var id = req.body.id;
    var name = req.body.name;
    var email = req.body.email;
    var passwd = req.body.passwd;
    db.run('UPDATE users SET login=?, name=?, email=?, passwd=? WHERE id=?', [name, name, email, passwd, id], () => {
        res.json({ message: 'Usuario modificado con éxito' });
    });
}

function processModificarCategoria(req, res, db) {
    var id = req.body.id;
    var name = req.body.name;
    db.get('SELECT name FROM categories WHERE id=?', [id], (err, row) => {
        if (!row) {
            res.json({ errormsg: 'Peticion mal formada' });
            return;
        }

        var oldName = row.name;

        db.run('UPDATE categories SET name=? WHERE id=?', [name, id], () => {
            db.run('UPDATE videos SET categoria=? WHERE categoria=?', [name, oldName], () => {
                res.json({ message: 'Categoría modificada con éxito' });
            });
        });
    });
}

function processModificarVideo(req, res, db) {
    var id = req.body.id;
    var titulo = req.body.titulo;
    var url = req.body.url;
    var categoria = req.body.categoria;
    db.run('UPDATE videos SET titulo=?, url=?, categoria=? WHERE id=?', [titulo, url, categoria, id], () => {
        res.json({ message: 'Vídeo modificado con éxito' });
    });
}

function processListarCategorias(req, res, db) {
    db.all('SELECT * FROM categories', [], (err, rows) => {
        // enviar en la respuesta serializado en formato JSON
        res.json(rows);
    });
}

function processCrearCategoria(req, res, db) {
    var name = req.body.name;
    db.run('INSERT INTO categories (name) VALUES (?)', [name], function() {
        res.json({ id: this.lastID, name: name });
    });
}

function processBorrarCategoria(req, res, db) {
    var id = req.params.id;
    db.run('DELETE FROM categories WHERE id=?', id, () => {
        res.json({ message: 'Categoría eliminada' });
    });
}

function processListarVideos(req, res, db) {
    db.all('SELECT * FROM videos', [], (err, rows) => {
        // enviar en la respuesta serializado en formato JSON
        res.json(rows);
    });
}

function processCrearVideo(req, res, db) {
    var titulo = req.body.titulo;
    var url = req.body.url;
    var categoria = req.body.categoria;
    db.get('SELECT name FROM categories WHERE name=?', [categoria], (err, row) => {
        if (!row) {
            res.json({ errormsg: 'Debes introducir una categoría valida' });
            return;
        }

        db.run('INSERT INTO videos (titulo, url, categoria) VALUES (?, ?, ?)', [titulo, url, categoria], function() {
            res.json({ id: this.lastID, titulo: titulo, url: url, categoria: categoria });
        });
    });
}

function processBorrarVideo(req, res, db) {
    var id = req.params.id;
    db.run('DELETE FROM videos WHERE id=?', id, () => {
        res.json({ message: 'Vídeo eliminado' });
    });
}

// Ahora la acción asociada al login sería:
router.post('/login', (req, res) => {
    // Comprobar si la petición contiene los campos ('user' y 'passwd')
    if (!req.body.user || !req.body.passwd) {
        res.json({ errormsg: 'Peticion mal formada'});
    } else {
        // La petición está bien formada -> procesarla
        processLogin(req, res, db); // Se la pasa tambien la base de datos
    }
});

router.put('/logout', (req, res) => {
    if (!req.body.session_id) {
        res.json({ errormsg: 'Peticion mal formada'});
    } else {
        processLogout(req, res, db);
    }
});

router.get('/users/:session_id', (req, res) => {
    verificarSesion(req.params.session_id, (valid) => {
        if (valid) {
            processListarUsuarios(req, res, db);
        } else {
            res.json({ errormsg: 'Peticion mal formada'});
        }
    });
});

router.post('/user', (req, res) => {
    verificarSesion(req.body.session_id, (valid) => {
        if (valid && req.body.name && req.body.email && req.body.passwd) {
            processCrearUsuario(req, res, db);
        } else {
            res.json({ errormsg: 'Peticion mal formada'});
        }
    });
});

router.delete('/user/:session_id/:id', (req, res) => {
    verificarSesion(req.params.session_id, (valid) => {
        if (valid) {
            processBorrarUsuario(req, res, db);
        } else {
            res.json({ errormsg: 'Peticion mal formada'});
        }
    });
});

router.get('/categories/:session_id', (req, res) => {
    verificarSesion(req.params.session_id, (valid) => {
        if (valid) {
            processListarCategorias(req, res, db);
        } else {
            res.json({ errormsg: 'Peticion mal formada'});
        }
    });
});

router.post('/category', (req, res) => {
    verificarSesion(req.body.session_id, (valid) => {
        if (valid && req.body.name) {
            processCrearCategoria(req, res, db);
        } else {
            res.json({ errormsg: 'Peticion mal formada'});
        }
    });
});

router.delete('/category/:session_id/:id', (req, res) => {
    verificarSesion(req.params.session_id, (valid) => {
        if (valid) {
            processBorrarCategoria(req, res, db);
        } else {
            res.json({ errormsg: 'Peticion mal formada'});
        }
    });
});

router.get('/videos/:session_id', (req, res) => {
    verificarSesion(req.params.session_id, (valid) => {
        if (valid) {
            processListarVideos(req, res, db);
        } else {
            res.json({ errormsg: 'Peticion mal formada'});
        }
    });
});

router.post('/video', (req, res) => {
    verificarSesion(req.body.session_id, (valid) => {
        if (valid && req.body.titulo && req.body.url && req.body.categoria) {
            processCrearVideo(req, res, db);
        } else {
            res.json({ errormsg: 'Peticion mal formada'});
        }
    });
});

router.delete('/video/:session_id/:id', (req, res) => {
    verificarSesion(req.params.session_id, (valid) => {
        if (valid) {
            processBorrarVideo(req, res, db);
        } else {
            res.json({ errormsg: 'Peticion mal formada'});
        }
    });
});

router.put('/user', (req, res) => {
    verificarSesion(req.body.session_id, (valid) => {
        if (valid && req.body.id && req.body.name && req.body.email && req.body.passwd) {
            processModificarUsuario(req, res, db);
        } else {
            res.json({ errormsg: 'Peticion mal formada'});
        }
    });
});

router.put('/category', (req, res) => {
    verificarSesion(req.body.session_id, (valid) => {
        if (valid && req.body.id && req.body.name) {
            processModificarCategoria(req, res, db);
        } else {
            res.json({ errormsg: 'Peticion mal formada'});
        }
    });
});

router.put('/video', (req, res) => {
    verificarSesion(req.body.session_id, (valid) => {
        if (valid && req.body.id && req.body.titulo && req.body.url && req.body.categoria) {
            processModificarVideo(req, res, db);
        } else {
            res.json({ errormsg: 'Peticion mal formada'});
        }
    });
});

// Añadir las rutas al servidor
server.use('/', router);

// Añadir las rutas estáticas al servidor.
server.use(express.static(__dirname));

// Poner en marcha el servidor ...
server.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});