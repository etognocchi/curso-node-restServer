const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg:'No hay token en la petición.'
        })
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        console.log('UUID: ', uid);
        // Leer el usuario del uid
        // req.usuarioAutenticado = await Usuario.findById( uid );


        //req.uid = uid;

        next();
        
    } catch (error) {
        console.error(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}


module.exports = {
    validarJWT
}