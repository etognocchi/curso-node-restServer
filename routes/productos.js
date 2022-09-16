const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRol } = require('../middlewares');
const { crearProducto, obtenerProducto , getProductos, actualizarProducto, deleteProducto} = require('../controllers/productos');
const { existeProductoPorId , existeCategoriaPorNombre} = require('../helpers/db-validators');

const router = Router();

// Obtener todas los productos - público
router.get('/', getProductos);

// Obtener un producto
router.get('/:id', [
    check('id', 'No es un ID de mongo valido.').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto);

// crear un producto - privado - cualquier persona con un token valido
router.post('/', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('estado', 'El estado es obligatorio').notEmpty(),
        check('categoria', 'La categoría es obligatorio').notEmpty(),
        check('categoria').custom(existeCategoriaPorNombre),
        validarCampos
    ] ,crearProducto );

// actualizar un prducto - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto);

// Borrar un producto - privado - usuario administrador
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id').custom( existeProductoPorId ),
    validarCampos
], deleteProducto);


module.exports = router;