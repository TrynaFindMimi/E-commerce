import { ProductosProxy } from '/proxyProductos.js';

document.addEventListener('DOMContentLoaded', function() {
    const contenedorDestacados = document.getElementById('destacados');

    function guardarCarrito(idProducto) {
        let carrito = JSON.parse(localStorage.getItem('productosCarrito')) || [];
        
        if (!carrito.includes(idProducto)) {
            carrito.push({id:idProducto,cantidad:1});
            localStorage.setItem('productosCarrito', JSON.stringify(carrito));
            alert(`Producto ${idProducto} agregado a carrito`);
        } else {
            alert('Este producto ya está en tu carrito');
        }
    }
    const idUsuario =JSON.parse(localStorage.getItem('usuario'));

    if(!idUsuario){
        window.location.href = "login.html";
    }


    ProductosProxy.productos           
    .then(productos => {
            productos.forEach(producto => {
                const articulo = document.createElement('div');
                articulo.className = 'swiper-slide';
                
                // Construir el contenido HTML
                articulo.innerHTML = `
                <article>
                    <img src="data:image/jpeg;base64, ${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p class="precio">Precio: $${producto.precio_unitario}</p>
                    <button onclick="guardarCarrito(${producto.id})">Agregar al Carrito </button>
                </article>   
                `;

                contenedorDestacados.appendChild(articulo);
            });
        })
        .catch(error => {
            console.error('Error al obtener productos destacados:', error);
            contenedorDestacados.innerHTML = '<p class="error">Error al cargar productos destacados</p>';
        });

        window.guardarCarrito = guardarCarrito;
});