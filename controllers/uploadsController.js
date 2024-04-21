const { response } = require('express');
const path = require('path');
const fs = require('fs');
const { subirArchivo } = require('../helpers');
const { Usuario, Producto} = require('../models');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

/* instalar :
npm i express-fileupload
npm i uuid
*/
const cargarArchivo = async (req, resp = response) => {
   
    /*
    if(!req.files || Object.keys(req.files).length === 0 || !req.files.archivo){
        resp.status(400).json({msg : 'No se han subido archivos'});
        return;
    }*/

    try {
        //Imagenes 
        //const nombre = await subirArchivo(req.files);
        const nombre = await subirArchivo(req.files, undefined, 'img');
        //const nombre = await subirArchivo(req.files,['txt','pdf'],'textos');
        resp.json({ nombre });
        
    } catch (ex) {
        resp.status(400).json({ex})
    }
        
    /*
    const { archivo } = req.files;
    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length-1];

    //Validar la extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if(!extensionesValidas.includes(extension)){
        return resp.status(400).json({
            msg: `La extensión ${ extension } no es permitida, estas son las permitidas: ${ extensionesValidas}`
        })
    }
    
    const nombreTemp = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname + '../uploads' + nombreTemp);

    archivo.mv(uploadPath, (err) => {
        if(err){
            return resp.status(500).send(err);
        }
        resp.json({msg: 'El archivo se subio correctamente a '+uploadPath})
    });

    resp.json({
        msg: 'Cargando Archivos'
    });
    */
}

const actualizarImg = async (req, resp = response) => {
    
    const { id, coleccion} = req.params;

    let modelo;

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return resp.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return resp.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
        default:
            return resp.status(500).json({msg: 'No es una coleccion válida'})
    }

    //Limpiar imágenes previas 
    if(modelo.img){
        //Borrar imagen del servidor 
        const pathImagen = path.join(__dirname,'../uploads', coleccion, modelo.img);
        if( fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    await modelo.save();

    resp.json(modelo);
}

const mostrarImage = async (req, resp = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return resp.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return resp.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
        default:
            return resp.status(500).json({msg: 'No es una coleccion válida'})
    }

    //Limpiar imágenes previas 
    if(modelo.img){
        //Borrar imagen del servidor 
        const pathImagen = path.join(__dirname,'../uploads', coleccion, modelo.img);
        if( fs.existsSync(pathImagen)){
            return resp.sendFile(pathImagen)
        }
    }

    const pathImagen = path.join(__dirname,'../assets/no-image.jpg');
    return resp.sendFile(pathImagen)   
}

const actualizarImgCloud = async (req, resp = response) => {
    
    const { id, coleccion} = req.params;

    let modelo;

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return resp.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return resp.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
        default:
            return resp.status(500).json({msg: 'No es una coleccion válida'})
    }

    //Limpiar imágenes previas 
    if(modelo.img){
        //Borrar imagen del servidor 
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length -1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);        
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url} = await cloudinary.uploader.upload(tempFilePath);
   
    modelo.img = secure_url;
    await modelo.save();

    resp.json(modelo);
}

module.exports = {
    cargarArchivo,
    actualizarImg,
    mostrarImage,
    actualizarImgCloud
}