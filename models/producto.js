const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
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
  },
  precio : {
    type: Number,
    default: 0
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
  },
  descripcion: {
    type: String
  },
  disponible: { 
    type: Boolean, 
    default: true
  },
  img: {
    type: String 
  }
});

ProductoSchema.methods.toJSON = function(){

  /* En está parte se está quitando el __v, el password y el _id del obj */
  const { __v, estado, ...producto } = this.toObject();
  return producto;
}

module.exports = model('Producto', ProductoSchema);
