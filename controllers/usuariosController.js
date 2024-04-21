const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {
  //Para obtener los datos que se colocan en la url  ej.
  // Ej. http://localhost:8080/api/usuarios/limite=10&desde=1
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  // const usuarios = await Usuario.find(query)
  //   .skip(Number(desde))
  //   .limit(Number(limite));
  // const total = await Usuario.countDocuments(query);

  //Desestructuracion de Arreglos
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    msg: 'get API - Controlador',
    total,
    usuarios,
  });
};

const usuariosPost = async (req = request, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  //Guardar en BD
  await usuario.save();

  res.json({
    msg: 'post API - Controlador',
    usuario,
  });
};

const usuariosPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  //To do Validar contra base de datos
  if (password) {
    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json({
    msg: 'put API - Controlador',
    usuario,
  });
};

const usuariosPatch = (req = request, res = response) => {
  res.json({
    msg: 'patch API - Controlador',
  });
};

const usuariosDelete = async (req = request, res = response) => {
  const { id } = req.params;
  //Eliminacion fisica
  // const usuario = await Usuario.findByIdAndDelete(id);
  //Eliminacion logica
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.json({
    msg: 'delete API - Controlador',
    usuario
  });
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosPatch,
  usuariosDelete,
};
