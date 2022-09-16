const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo , actualizarImagen, mostrarImagen, actualizarImagenCloudDinary} = require('../controllers/uploads');

const { coleccionesPermitidas } = require('../helpers'); 
const { validarArchivoSubir, validarCampos } = require('../middlewares');

const router = Router();

router.post( '/', validarArchivoSubir, cargarArchivo );

router.put( '/:coleccion/:id', [
    check('id', 'El id debe ser un id de mongo').isMongoId(),
    validarArchivoSubir,
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'] ) ),
    validarCampos
], actualizarImagenCloudDinary );

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser un id de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'] ) ),
    validarCampos
], mostrarImagen );

module.exports = router;