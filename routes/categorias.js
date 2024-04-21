const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, esAdminRole} = require('../middlewares');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const {
    categoriasGet,
    categoriaGetById,    
    categoriaPost,
    categoriaPut,
    categoriaDelete,
} = require('../controllers/categoriasController');

const router = Router();

//Obtener todas las categorias - publico
router.get('/', categoriasGet);

//Obtener una categoria por id - publico
//middleware personalizado para verificar el id 
//verificar existeCategoria parecido a db-validators 
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId), 
    validarCampos 
], categoriaGetById);

//Crear categoria - privado - cualquiera con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
],categoriaPost)

//Actualizar categoria - privado - cualquiera con un token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId), 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], categoriaPut)

//Borrar categoria - Role Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId), 
    validarCampos
], categoriaDelete);

module.exports = router;