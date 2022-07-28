const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        // Middlewares
        this.middlewares();

        // rutas de mi aplicación
        this.routes();
    }

    middlewares() {
        // CORS
        this.app.use( cors() );

        // Lectura y parceo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );   
    }

    routes() {
       this.app.use( this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen(this.port, () => console.log(`listening on http://localhost:${this.port}`));
    }

}

module.exports = Server;