document.addEventListener('DOMContentLoaded', function() {
    const contenedorDestacados = document.getElementById('catalogo');

    function guardarCarrito(idProducto) {
        let carrito = JSON.parse(localStorage.getItem('productosCarrito')) || [];
        
        if (!carrito.includes(idProducto)) {
            carrito.push({id:idProducto,cantidad:1});
            localStorage.setItem('productosCarrito', JSON.stringify(carrito));
            alert(`Producto ${idProducto} agregado a Carrito`);
        } else {
            alert('Este producto ya está en tus Carrito');
        }
    }
    const idUsuario =JSON.parse(localStorage.getItem('usuario'));


    if(!idUsuario){
        window.location.href = "login.html";
    }


    fetch('http://localhost:3000/productos')
        .then(response => response.json())
        .then(productos => {
            productos.forEach(producto => {
                const articulo = document.createElement('div');
                articulo.className = 'producto';
                
                // Construir el contenido HTML
                articulo.innerHTML = `
                    <img src="data:image/jpeg;base64, ${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p class="precio">Precio: $${producto.precio_unitario}</p>
                    <button onclick="guardarCarrito(${producto.id})">Agregar al Carrito </button>  
                    <button>Agregar a Carrito</button>
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