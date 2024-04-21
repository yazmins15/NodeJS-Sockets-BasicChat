const { response } = require('express');

const validarArchivoSubir = (req, resp = response, next) => {

    if(!req.files || Object.keys(req.files).length === 0 || !req.files.archivo){
        return resp.status(400).json({
            msg : 'No se han subido archivos'
        });        
    }

    next();
}

module.exports = {
    validarArchivoSubir
}