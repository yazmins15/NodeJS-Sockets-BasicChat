const { Socket } = require("socket.io");
const { comprobarJWT } = require('../helpers');
const { ChatMensajes } = require('../models');
const chatMensajes = new ChatMensajes(); 


const socketController = async(socket = new Socket(), io) => {    
    
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
    if(!usuario){
        return socket.disconnect();
    }

    //Agregar el usuario conectado 
	chatMensajes.conectarUsuario(usuario);
	io.emit('usuarios-activos', chatMensajes.usuariosArr);
	socket.emit('recibir-mensajes', chatMensajes.ultimos10);
	socket.emit('mensaje-privado', chatMensajes.ultimos10Privados);

    //Salas : Global, socket.id y usuario.id
	
	//Conectarlo a una sala especial
	socket.join(usuario.id); //Aquí se crea la sala del usuario.id

    //Limpiar cuando alguien se desconecta 
	socket.on('disconnect', () => {
		chatMensajes.desconectarUsuario(usuario.id);
		io.emit('usuarios-activos', chatMensajes.usuariosArr);
	})

    socket.on('recibir-mensajes', (payload) => {
		dibujarMensajes(payload);		
	})

	socket.on('mensaje-privado', (payload) => {
		dibujarMensajesPrivados(payload);		
	})
	
	socket.on('enviar-mensaje', ({uid, mensaje}) => {
		       
		if(uid){
			//Mensaje privado 
			chatMensajes.enviarMensajePrivado(usuario.id, usuario.nombre, mensaje);
			socket.to(uid).emit('mensaje-privado', chatMensajes.ultimos10Privados);
		}else{
		    chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
		    io.emit('recibir-mensajes', chatMensajes.ultimos10);
		}

	})
}

module.exports = {
    socketController
}