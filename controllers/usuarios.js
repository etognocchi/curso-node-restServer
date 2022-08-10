const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async(req = request, res = response) => {
    const {limite = 5, desde = 0} = req.query;

    const usuarios = await Usuario.find()
        .skip(Number(desde))
        .limit(Number(limite));

    res.json({
        ok: true,
        msg: 'get API - controlador',
        usuarios
    });
}

const usuariosPut = async (req, res = response) => {
    const id = req.params.id;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO Validar con BD

    if ( password ) {
        // encriptar la contraseña
        const salt = bcryptjs.genSaltSync(); // por defecto va en 10 el número de vueltas
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        ok: true,
        msg: 'put API - controlador',
        usuario
    });
}

const usuariosPost = async (req, res = response) => {

    

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );

    // encriptar la contraseña
    const salt = bcryptjs.genSaltSync(); // por defecto va en 10 el número de vueltas
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await usuario.save();
    
    res.status(201).json({
        ok: true,
        msg: 'post API - controlador',
        usuario
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'delete API - controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}