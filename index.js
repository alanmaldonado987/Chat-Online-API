const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io')
const fs = require('fs');

app.use(cors())

const port = 3001;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3002',
        methods: ['GET', 'POST'] 
    }
})

io.on('connection', (socket)=>{
    console.log('Usuario actual: ', socket.id);

    socket.on('join_room', (data)=>{ 
        socket.join(data);
        console.log('Usuario con ID: ', socket.id, 'se unió a la sala', data);
    })

    socket.on('send_message', (data)=>{
        socket.to(data.room).emit('receive_message', data);
    })

    socket.on('sendFile', (data) => {
        const { fileName, fileData } = data;
         fs.writeFile(`uploads/${fileName}`, fileData, 'base64', (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(`Archivo guardado: ${fileName}`);
         })
    })

    socket.on('disconnect', ()=>{
        console.log('Usuario Desconectado!', socket.id);
    })
})

server.listen(port,  ()=>{
    console.log('Servidor Corriendo en el puerto: ', port);
});
