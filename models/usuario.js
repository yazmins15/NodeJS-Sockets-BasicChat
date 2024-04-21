
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  correo: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],   
  },
  img: {
    type: String
  },
  rol: {
    type: String,
    required: true,
    enum: ['ADMIN_ROLE','USER_ROLE','VENTAS_ROLE']   
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  },
});

/* Sobreescribir el metodo toJSON,
tiene que ser una función normal
porque se va a ocupar el objeto this y una función de flecha mantiene a lo que apunta el this fuera de la función */
UsuarioSchema.methods.toJSON = function(){

  /* En está parte se está quitando el __v, el password y el _id del obj */
  const { __v, password, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
}

module.exports = model('Usuario', UsuarioSchema);