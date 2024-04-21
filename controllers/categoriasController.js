const { response, request } = require('express');
const Categoria = require('../models/categoria');

//ObtenerCategorias - paginado - total - populate 
const categoriasGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado : true};

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
                 .populate('usuario','nombre')
                 .skip(Number(desde))
                 .limit(Number(limite)),
    ]);

    res.json({
        total,
        categorias,
     });
};

//ObtenerCategoria - populate
const categoriaGetById = async (req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario','nombre');

    res.json({ categoria });
};

//Crear Categoria
const categoriaPost = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe `, 
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria (data);

    //Guardar DB 
    await categoria.save();
    res.status(201).json(categoria);
};

//Actualizar Categoria 
const categoriaPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    //se pone new : true para que regrese la data nueva y salga en la respuesta
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json({ categoria });
};

//Borrar Categoria - estado:false
const categoriaDelete = async (req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, {new: true});

    res.json({ categoria });
};

module.exports = {
    categoriasGet,
    categoriaGetById,    
    categoriaPost,
    categoriaPut,
    categoriaDelete,
  };