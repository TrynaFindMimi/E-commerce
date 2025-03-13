import { ProductosProxy } from '/proxyProductos.js';
document.addEventListener("DOMContentLoaded", () => {
    const favoritosContainer = document.querySelector(".lista-favoritos");

    // Obtener favoritos de localStorage o inicializar vacío
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    let productos = [];

    function guardarCarritoFav(idProducto) {
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


    function loadProductos() {
        ProductosProxy.productos
            .then(items => {
                productos = [...items]; 
                getProductosfavoritos()
            })
            .catch(error => console.error('Error:', error));
    }


    function getProductosfavoritos() {
        const productosEnFavoritos = productos.filter(producto => 
            favoritos.some(item => item.id === producto.id));   
        mostrarFavoritos(productosEnFavoritos);
    }

    // Función para renderizar favoritos
    function mostrarFavoritos(productosFiltrados) {
        favoritosContainer.innerHTML = ""; // Limpiar el contenedor

        if (productosFiltrados.length === 0) {
            favoritosContainer.innerHTML = "<p>No tienes productos en favoritos.</p>";
            return;
        }

        productosFiltrados.forEach(producto => {
            const productoElemento = document.createElement("div");
            productoElemento.className = 'producto-favorito';
            productoElemento.innerHTML =`
                <img src="data:image/jpeg;base64,${producto.imagen}" alt="${producto.nombre}">
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p class="precio">${producto.precio_unitario}</p>
                    <button onclick="guardarCarritoFav(${producto.id})">Agregar al Carrito</button>
                    <button class="eliminar" data-id="${producto.id}">Eliminar de Favoritos</button>
                </div>
            `;

            favoritosContainer.appendChild(productoElemento);
        });

        agregarEventos();
    }

    // Función para eliminar un producto de favoritos
    function eliminarFavorito(id) {
        favoritos = favoritos.filter((producto) => producto.id !== parseInt(id));
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        getProductosfavoritos();
    }

    // Agregar eventos a los botones dinámicamente
    function agregarEventos() {
        document.querySelectorAll(".eliminar").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const id = e.target.getAttribute("data-id");
                eliminarFavorito(id);
            });
        });
    }

    loadProductos();
    window.guardarCarritoFav = guardarCarritoFav;
});
