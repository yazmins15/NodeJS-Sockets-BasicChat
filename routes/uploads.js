const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { cargarArchivo, actualizarImg, mostrarImage, actualizarImgCloud } = require('../controllers/uploadsController');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe de ser de mongo').isMongoId(),    
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'])),
    validarCampos
],  actualizarImgCloud);

router.get('/:coleccion/:id',[
    check('id', 'El id debe de ser de mongo').isMongoId(),    
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'])),
    validarCampos
], mostrarImage);

module.exports = router;