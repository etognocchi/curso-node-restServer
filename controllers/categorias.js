const { response } = require("express");
const { Categoria } = require('../models');

// obtener categorias - paginado - total - populate
const getCategorias = async ( req, res = response ) => {
    const { limite = 5 , desde = 0 } = req.query;
    const query = { estado: true };

    const [ total , categoriasYusuario ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);


    if( total === 0 ){
        return res.status(404).json({
            ok: true,
            msg: 'No existen categorías'
        });
    }

    const categorias = categoriasYusuario.map( categoria => {
        return {
            id: categoria.id,
            nombre: categoria.nombre,
            usuario: categoria.usuario.nombre
        }
    });

    res.status(200).json({
        ok: true,
        categorias
    })
    

}

// obtener categoria - populate {}
const obtenerCategoria = async ( req, res = response ) => {
    const id = req.params.id;

    const categoriaYusuario = await Categoria.findById( id ).populate('usuario');

    const categoria = {
        id,
        nombre: categoriaYusuario.nombre,
        usuario: categoriaYusuario.usuario.nombre
    }

    res.status(200).json({
        ok: true,
        categoria
    })
}

const crearCategoria = async ( req, res = response ) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre}, ya existe`
        });
    }

    // Guardar la data
    const data = {
        nombre,
        usuario: req.usuarioAutenticado._id
    }

    const categoria = new Categoria( data );
    await categoria.save();

    return res.status(201).json({
        categoria
    })
}


// actualizar categoría recibe el nombre
const actualizarCategoria = async ( req, res = response ) => {
    if(!req.body.nombre) {
        return res.status(400).json({
            ok: false,
            msg: 'Es necesario enviar un nombre de categoría.'
        });
    }

    const id = req.params.id;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuarioAutenticado._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
        ok: true,
        categoria
    });
}

// borrar categoría - estado false
const deleteCategoria = async ( req, res = response ) => {
    const id = req.params.id;

    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, { new:true });

    res.status(200).json({
        ok: true,
        categoria
    });

}

module.exports = {
    getCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    deleteCategoria
}