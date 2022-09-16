const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config({ 
  cloud_name: process.env.CLOUDDINARY_NAME, 
  api_key: process.env.CLOUDDINARYAPI_KEY, 
  api_secret: process.env.CLOUDDINARYAPI_SECRET 
});

const { subirArchivo } = require('../helpers');
const { response } = require("express");
const { Usuario, Producto } = require('../models');

const cargarArchivo = async (req , res = response) => {
  
  try {    
    const nombre = await subirArchivo( req.files );
  
    res.status(200).json({
      nombre
    });
  } catch (error) {
    res.status(400).json(error);
  }

    
}

const actualizarImagen = async ( req, res = response ) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);

      if( !modelo ){
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        })
      }

      break;

    case 'productos':
      modelo = await Producto.findById(id);

      if( !modelo ){
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        })
      }

      break;

    default:
      return res.status(500).json({
        msg: 'Se me olvido validar esto.'
      })
  }

  // limpiar imagenes previas
  try {
    if( modelo.img ){
      // hay que borrar la imagen del servidor.
      const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
      // pregunto si existe la imagen, la borro.
      if( fs.existsSync( pathImagen ) ){
        fs.unlinkSync( pathImagen );
      }
    }
  } catch (err) {
    
  }

  const nombre = await subirArchivo( req.files , undefined, coleccion );
  modelo.img = nombre;

  await modelo.save();

  res.json({
    modelo
  })


}

const actualizarImagenCloudDinary = async ( req, res = response ) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);

      if( !modelo ){
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        })
      }

      break;

    case 'productos':
      modelo = await Producto.findById(id);

      if( !modelo ){
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        })
      }

      break;

    default:
      return res.status(500).json({
        msg: 'Se me olvido validar esto.'
      })
  }

  // limpiar imagenes previas
  try {
    if( modelo.img ){
      // hay que borrar la imagen del servidor.
      const nombreArr = modelo.img.split('/');
      const nombre = nombreArr[nombreArr.length - 1];
      const [ public_id ] = nombre.split('.');
      cloudinary.uploader.destroy(public_id);

    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;

    await modelo.save();

  } catch(err) {
    console.error(err);
  }

  res.json({
    modelo
  });

}

const mostrarImagen = async (req, res = response ) => {
  const {id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);

      if( !modelo ){
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        })
      }

      break;

    case 'productos':
      modelo = await Producto.findById(id);

      if( !modelo ){
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        })
      }

      break;

    default:
      return res.status(500).json({
        msg: 'Se me olvido validar esto.'
      })
  }

  // limpiar imagenes previas
  try {
    
    if( modelo.img ){
      // hay que borrar la imagen del servidor.
      const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
      // pregunto si existe la imagen.
      if( fs.existsSync( pathImagen ) ){
        return res.sendFile( pathImagen );
      }
    }
  
    // Si el modelo no tiene una imagen, se muestra una por defecto.
    const noImagen = path.join( __dirname, '../assets/no-image.jpg' );
    return res.sendFile( noImagen );

  } catch (err) {
    return res.status(500).json({
      msg: 'Se me olvido validar esto.',
      err
    })
  }
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudDinary
}