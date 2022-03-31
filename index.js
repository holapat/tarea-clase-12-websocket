const express = require('express');
const fs = require('fs')
const app = express();
const PORT = 8080;

const {Server: HttpServer} = require('http')
const {Server: IOServer} = require('socket.io')
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

httpServer.listen(8080, ()=> console.log('Servidor levantado'));

const productos = [];
const messages = [{ author: "example@gmail.com", date:"[30/3/2022 18:12:47]", text: "¡Hola! cuentanos lo que piensas"}]
fs.writeFileSync('./chat-messages.txt', JSON.stringify(messages))


app.use(express.static('./views'));

/*config Ejs */
app.set('view engine', 'ejs')

app.get('/', (req, res)=>{
    res.render('formulario', {productos})
})


io.on('connection', (socket)=>{
    console.log("Usuario conectado")

    //envia al cliente los productos que ya estan guardados
    socket.emit('products', productos)

    //recibe y envia a todos los clientes los productos nuevos y viejos
    socket.on('new-product', (data)=>{
        console.log(data) 
        productos.push(data)
        io.sockets.emit('products', productos)
    })

    socket.emit("chat", messages)

    socket.on('new-message', (data)=>{
        messages.push(data)
        console.log(messages)
        fs.writeFileSync('./chat-messages.txt', JSON.stringify(messages))
        io.sockets.emit('chat', messages)
    })
});