const { response, request } = require('express');


const usuariosGet = (req = request, res = response) => {
    const {q, nombre, apikey} = req.query;

    res.json({
        ok: true,
        msg: 'get API - controlador',
        q,
        nombre,
        apikey
    });
}

const usuariosPut = (req, res = response) => {
    const id = req.params.id;

    res.json({
        ok: true,
        msg: 'put API - controlador',
        id
    });
}

const usuariosPost = (req, res = response) => {
    const body = req.body;
    
    res.status(201).json({
        ok: true,
        msg: 'post API - controlador',
        body
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