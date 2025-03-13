import { ProductosProxy } from '/proxyProductos.js';
document.addEventListener('DOMContentLoaded', function() {
    const subtotal = document.getElementById('subtotal');
    const totalCompra = document.getElementById('total');
    const nombre = document.getElementById('nombre');
    const fecha = document.getElementById('fecha');
    const metodo = document.getElementById('meth');
    const totalPagarElement = document.getElementById('lista'); 
    const carrito = JSON.parse(localStorage.getItem('productosCarrito')) || [];
    let productos = [];
    function loadProductos() {
        ProductosProxy.productos
            .then(items => {
                productos = [...items]; 
                getProductosCarrito()
            })
            .catch(error => console.error('Error:', error));
    }
    function getProductosCarrito() {
        const productosEnCarrito = productos.filter(producto => 
                    carrito.some(item => item.id === producto.id));   
        mostrarProductosCarrito(productosEnCarrito);
        localStorage.removeItem('productosCarrito');
    }

    // Función para mostrar productos en el carrito
    function mostrarProductosCarrito(productosEnCarrito) {
        totalPagarElement.innerHTML = '';
        
        productosEnCarrito.forEach(producto => {
            const itemCarrito = carrito.find(item => item.id === producto.id);
            const cantidad = itemCarrito ? itemCarrito.cantidad : 1;

            const articulo = document.createElement('div');
            articulo.className = 'producto-carrito';
            articulo.innerHTML = `
                <img src="data:image/jpeg;base64,${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p class="precio">${producto.precio_unitario} Bs</p>
                    <div class="cantidad">
                        <span class="cantidad-numero" data-id="${producto.id}">${cantidad}</span>
                    </div>
                </div>
              
            `;

            totalPagarElement.appendChild(articulo);
        });
    }
    const idUsuario =JSON.parse(localStorage.getItem('usuario'));


    if(!idUsuario){
        window.location.href = "login.html";
    }
        // Inicializar
    loadProductos();

    const datos =JSON.parse(localStorage.getItem('datosCheckout'));
    const usuario =JSON.parse(localStorage.getItem('usuario'));
    subtotal.textContent = `${datos.total.toFixed(2)} Bs`;
    totalCompra.textContent = `${(datos.total+50).toFixed(2)} Bs`;
    nombre.textContent =usuario.nombre;
    fecha.textContent = datos.fechaCompra;
    metodo.textContent = datos.metodoPago;
});
