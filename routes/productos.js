const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, esAdminRole} = require('../middlewares');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const {
    productosGet,
    productoGetById,    
    productoPost,
    productoPut,
    productoDelete,
} = require('../controllers/productosController');

const router = Router();

//Obtener todas los productos - publico
router.get('/', productosGet);

//Obtener un producto por id 
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId), 
    validarCampos 
], productoGetById);

//Crear producto - privado - cualquiera con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'Categoria no es un ID válido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId), 
    validarCampos
],productoPost)

//Actualizar producto - privado - cualquiera con un token valido
router.put('/:id', [
    validarJWT, 
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),    
    //check('categoria', 'Categoria no es un ID válido').isMongoId(),
    //check('categoria').custom(existeCategoriaPorId),     
    validarCampos
], productoPut)

//Borrar producto - Role Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId), 
    validarCampos
], productoDelete);

module.exports = router;