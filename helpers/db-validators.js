const { Usuario, Role, Categoria, Producto } = require('../models');

const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne( { rol } );
    if(!existeRol){
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail){
        throw new Error(`El correo ${correo} ya está registrado.`);
    }
}

const existeUsuarioPorId = async ( id ) => {
    const existeUsuario = await Usuario.findById( id );
    if (!existeUsuario){
        throw new Error(`El usuario no está registrado en la BD.`);
    }
}

const existeCategoria = async ( id ) => {
    const existeCategoria = await Categoria.find( {id , estado: true} );
    if (!existeCategoria){
        throw new Error(`La Categoria no está registrado en la BD.`);
    }
}

const existeCategoriaPorNombre = async ( nombre ) => {
    nombre = nombre.toUpperCase();

    const existeCategoria = await Categoria.find( {nombre , estado: true} );
    if (!existeCategoria){
        throw new Error(`La Categoria ${nombre} no está registrado en la BD.`);
    }
}

const existeProductoPorId = async ( id ) => {
    const existeProducto = await Producto.find( {id , estado: true} );
    if (!existeProducto){
        throw new Error(`El Producto no está registrado en la BD.`);
    }
}

const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes( coleccion );
    if( !incluida ){
        throw new Error(`La colección no está permitida`);
    }

    return true;
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeCategoriaPorNombre,
    existeProductoPorId,
    coleccionesPermitidas
}