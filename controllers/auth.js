const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSingIn = ( req, res = response ) => {
    const { id_token } = req.body;

    try {
        
        const { correo, nombre, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne( { correo } );

        if(!usuario){
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: '123',
                img,
                google: true
            }

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usaurio en BD
        if ( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            msg: 'OK',
            usuario,
            token
        })    

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar.'
        })
    }

}

module.exports = {
    login,
    googleSingIn
}