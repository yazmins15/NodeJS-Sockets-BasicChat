const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true
  },
  estado : {
    type: Boolean,
    default: true,
    required: [true, 'El estado es obligatorio']
  },
  usuario : {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El usuario es obligatorio']
  }
});

CategoriaSchema.methods.toJSON = function(){

  /* En está parte se está quitando el __v, el password y el _id del obj */
  const { __v, ...categoria } = this.toObject();
  return categoria;
}

module.exports = model('Categoria', CategoriaSchema);
