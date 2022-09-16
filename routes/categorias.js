const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRol } = require('../middlewares');
const { crearCategoria, obtenerCategoria , getCategorias, actualizarCategoria, deleteCategoria} = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');

const router = Router();

// Obtener todas las categorías - público
router.get('/', getCategorias);

// Obtener una categoría
router.get('/:id', [
    check('id', 'No es un ID de mongo valido.').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], obtenerCategoria);

// crear una categoría - privado - cualquier persona con un token valido
router.post('/', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        validarCampos
    ] ,crearCategoria );

// actualizar una categoría - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id').custom( existeCategoria ),
    validarCampos
], actualizarCategoria);

// Borrar una categoría - privado - usuario administrador
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id').custom( existeCategoria ),
    validarCampos
], deleteCategoria);


module.exports = router;