const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async ( req , res = response ) => {

    const { correo, password } = req.body;

    try {

        // Verdificar si existe el correo
        const usuario = await Usuario.findOne( {correo} );
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // Verificar si el usuario está activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado:false'
            });
        }

        // Verificar la contraseña
        const validPass = bcryptjs.compareSync( password, usuario.password );
        if(!validPass){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            msg: 'login ok',
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Contacte al administrador'
        });
    }

}

module.exports = {
    login
}