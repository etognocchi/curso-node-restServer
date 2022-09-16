const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:   '/api/productos',
            uploads:    '/api/uploads',
            usuarios:   '/api/usuarios'
        }

        // conectar la base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use( cors() );

        // Lectura y parceo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );   

        // FileUpload - Carga de archivos.
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true  // Con esta propiedad se crea automáticamente la carpeta que no exista en la ruta.
        }));

    }

    routes() {
        this.app.use( this.paths.auth , require('../routes/auth'));
        this.app.use( this.paths.buscar , require('../routes/buscar'));
        this.app.use( this.paths.categorias , require('../routes/categorias'));
        this.app.use( this.paths.productos , require('../routes/productos'));
        this.app.use( this.paths.uploads , require('../routes/uploads'));
        this.app.use( this.paths.usuarios , require('../routes/usuarios'));
    }

    listen() {
        this.app.listen(this.port, () => console.log(`listening on http://localhost:${this.port}`));
    }

}

module.exports = Server;