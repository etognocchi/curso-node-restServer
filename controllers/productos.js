const { response } = require("express");
const { Producto, Categoria } = require('../models')


const getProductos = async (req, res = response) => {
    const { limite = 5 , desde = 0 } = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        ok: true,
        total,
        productos
    })

}

const obtenerProducto = async (req, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.status(200).json({
        ok: true,
        producto
    });
}

const crearProducto = async (req, res = response) => {
    /* {
        nombre: 'tortilla',
        estado: true,
        precio: 10,
        categoria: 'Galleta',
        descripcion: 'algo',
        disponible: true
    } */

    const { categoria, nombre, ...data } = req.body;

    const nombreMayus = nombre.toUpperCase();
    const productoBd = await Producto.findOne( { nomobre: nombreMayus } );

    if( productoBd ) {
        return res.status(400).json({
            msg: `El Producto ${productoBd.nombre}, ya existe`
        });
    }
    const categoriaMayus = categoria.toUpperCase();
    const categoriaBd = await Categoria.findOne( {nombre: categoriaMayus} );
    
    data.categoria = categoriaBd._id;
    data.usuario = req.usuarioAutenticado._id;
    data.nombre = nombreMayus;

    const producto = new Producto( data );
    await producto.save();

    return res.status(201).json({
        producto
    })

}

const actualizarProducto = async (req, res = response) => {
    const id = req.params.id;
    const { estado, usuario, categoria, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuarioAutenticado._id;

    if(categoria) {
        const categoriaBD = await Categoria.findOne({ nombre: categoria.toUpperCase() });
        if(categoriaBD) {
            data.categoria = categoriaBD._id;
        }
    }

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
        ok: true,
        producto
    });
}

const deleteProducto = async (req, res = response) => {
    const id = req.params.id;

    const producto = await Producto.findByIdAndUpdate(id, {estado: false}, { new:true });

    res.status(200).json({
        ok: true,
        producto
    });
}


module.exports = { 
    crearProducto, 
    obtenerProducto, 
    getProductos, 
    actualizarProducto, 
    deleteProducto
}