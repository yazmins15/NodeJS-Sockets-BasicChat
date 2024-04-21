const { Router } = require('express');
const { buscar } = require('../controllers/buscarController')

const router = Router();

/*
   coleccion puede ser:
        -usuarios  
        -categorias 
        -productos        
        -roles
   termino   :  palabra a buscar en la coleccion 
 */
router.get('/:coleccion/:termino',buscar);

module.exports = router;