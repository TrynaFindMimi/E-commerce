document.addEventListener('DOMContentLoaded', function() {
    const contenedorDestacados = document.getElementById('destacados');

    function guardarFavorito(idProducto) {
        let favoritos = JSON.parse(localStorage.getItem('productosFavoritos')) || [];
        
        if (!favoritos.includes(idProducto)) {
            favoritos.push(idProducto);
            localStorage.setItem('productosFavoritos', JSON.stringify(favoritos));
            alert(`Producto ${idProducto} agregado a favoritos`);
        } else {
            alert('Este producto ya está en tus favoritos');
        }
    }


    fetch('http://localhost:3000/productos/destacados')
        .then(response => response.json())
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
                    <button onclick="guardarFavorito(${producto.id})">Agregar al Carrito </button>
                </article>   
                `;

                contenedorDestacados.appendChild(articulo);
            });
        })
        .catch(error => {
            console.error('Error al obtener productos destacados:', error);
            contenedorDestacados.innerHTML = '<p class="error">Error al cargar productos destacados</p>';
        });

        window.guardarFavorito = guardarFavorito;
});