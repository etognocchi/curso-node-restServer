const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesPermitidas = [ 'png', 'jpg', 'jpeg', 'gif', 'txt' ], carpeta = '') => {

    return new Promise( (resolve, reject) => {

        const { archivo } = files;
    
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1 ];

        if( !extensionesPermitidas.includes(extension) ){
            return reject(`La extensión ${extension} no es permitida. Use una de estas ${extensionesPermitidas}`);
        }
    
        const nombreTemp = uuidv4() + '.' + extension;
        uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp );
      
        archivo.mv(uploadPath, function(err) {
          if (err) {
            return reject(err);
          }
      
          resolve(nombreTemp);
        });
    });

}


module.exports = {
    subirArchivo
}