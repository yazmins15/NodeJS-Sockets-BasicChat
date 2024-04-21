const { response } = require('express');
const { isValidObjectId } = require("mongoose");
//const ObjectId = require("mongoose").Types.ObjectId;
const {Usuario, Categoria, Producto, Role} = require('../models/index');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async(termino='', res = response) => {
   
    const esMongoId = isValidObjectId(termino);
    //const esMongoId = ObjectId.isValid(termino)
    if(esMongoId){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [ usuario ] : []
        })
    }

    const regex = new RegExp(termino, 'i'); //Para que sea insensible a las minusculas y mayusculas
    const usuarios = await Usuario.find({       
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    })

    res.json({
        results : usuarios 
    });
}

const buscarCategorias = async(termino='', res = response) => {

    const esMongoId = isValidObjectId(termino);
    if(esMongoId){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [ categoria ] : []
        })
    }

    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({ nombre: regex, estado: true });
   
    res.json({
        results : categorias 
    });
}

const buscarProductos = async(termino='', res = response) => {

    const esMongoId = isValidObjectId(termino);
    if(esMongoId){
        const producto = await Producto.findById(termino).populate('categoria','nombre');
        return res.json({
            results: (producto) ? [ producto ] : []
        })
    }

    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({
        $or: [{ nombre: regex }, { descripcion: regex }],
        $and: [{ estado: true }]
    }).populate('categoria','nombre');
   
    res.json({
        results : productos 
    });
}

const buscarRoles = async(termino='', res = response) => {

    const esMongoId = isValidObjectId(termino);
    if(esMongoId){
        const rol = await Role.findById(termino);
        res.json({
            results: (rol) ? [ rol ] : []
        })
    }

    const regex = new RegExp(termino, 'i');
    const roles = await Role.find({ rol: regex });
   
    res.json({
        results : roles 
    });
}


const buscar = (req, res = response) => {

    const {coleccion, termino}= req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion){
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'categorias':
            buscarCategorias(termino, res);
        break;
        case 'productos':
            buscarProductos(termino, res);
        break;
        case 'roles':
            buscarRoles(termino, res);
        break;
        default: 
            return res.status(400).json({
                msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
            })
    }
 } 

 module.exports = {
    buscar
 }