const socket = io.connect();

socket.on('mi mensaje', (data)=>{
    socket.emit('notificacion', 'mensaje recibido con exito')
})

//Renderiza los productos (nuevos y viejos) al cliente
socket.on('products', (data)=>{
    render(data)
})

socket.on("chat", (data)=>{
    renderMessages(data)
})

//Envia un nuevo producto al servidor
function addProduct(e){
    let newProduct = {
        name: document.getElementById('nombre').value,
        price: document.getElementById('precio').value,
        img: document.getElementById('imagen').value
    };
    socket.emit('new-product', newProduct);
    return false;
}

//renderiza todos los productos del array
function render(productos){   
    if(productos.length !==0){
        let html = productos.map((elem, index) => {
        return `
        <tr style="color: orange;">
            <td>Nombre: ${elem.name}</td>
            <td>Precio: $${elem.price}</td>
            <td><img src="${elem.img}" alt="" width="30px"></td>
        </tr>
        `
        }).join(' ');
        document.getElementById('productos').innerHTML = html
    }else{
        let html =  `<h3 style="color: orange">No se encontraron productos</h3>`
        document.getElementById('productos').innerHTML = html
    }
}

//Muestra en pantalla los mensajes
function renderMessages(msg) {
    const html = msg.map((elem, index) => {
        return `<div>
        <strong style="color: blue">${elem.author}</strong>
        <em style= "color: brown">${elem.date}: </em>
        <em style= "font-style: italic; color: green">${elem.text}</em> </div>`
    }).join(' ');
    document.getElementById('mensajes').innerHTML = html
}

//Envia los nuevos mensajes para ser renderizados
function addMessage(e){
    let hoy = new Date();
    let fecha = hoy.getDate() + '/' + ( hoy.getMonth() + 1 ) + '/' + hoy.getFullYear();
    let hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
    let fechaYHora = fecha + ' ' + hora;

    let mensaje = {
        author: document.getElementById('email').value, 
        text: document.getElementById('text').value,
        date: `[${fechaYHora}]`
    };
    socket.emit('new-message', mensaje);
    return false;
}

