document.addEventListener('DOMContentLoaded', function() {
    const subtotal = document.getElementById('subtotal');
    const totalCompra = document.getElementById('total');
    const totalPagarElement = document.getElementById('total-pagar'); 
    const carrito = JSON.parse(localStorage.getItem('productosCarrito')) || [];
    let productos = [];
    function loadProductos() {
        fetch('http://localhost:3000/productos')
            .then(response => response.json())
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
        calcularTotal(productosEnCarrito);
    }

    // Función para mostrar productos en el carrito
    function mostrarProductosCarrito(productos) {
        totalPagarElement.innerHTML = '';
        
        productos.forEach(producto => {
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
                        <button class="btn-cantidad" data-id="${producto.id}" data-accion="restar">-</button>
                        <span class="cantidad-numero" data-id="${producto.id}">${cantidad}</span>
                        <button class="btn-cantidad" data-id="${producto.id}" data-accion="sumar">+</button>
                    </div>
                </div>
                <button class="eliminar" data-id="${producto.id}">Eliminar</button>
            `;

            totalPagarElement.appendChild(articulo);
        });

        agregarEventListeners();
    }

    function calcularTotal(productos) {
        let total = 0;
        
        carrito.forEach(item => {
            const producto = productos.find(p => p.id === item.id);
            if(producto) {
                total += producto.precio_unitario * item.cantidad;
            }
        });
        
        subtotal.textContent = `${total.toFixed(2)} Bs`;
        totalCompra.textContent = `${(total+50).toFixed(2)} Bs`;
    }

    function agregarEventListeners() {
        // Botones de cantidad
        document.querySelectorAll('.btn-cantidad').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productoId = parseInt(e.target.dataset.id);
                const accion = e.target.dataset.accion;
                
                actualizarCantidad(productoId, accion);
            });
        });
        document.querySelectorAll('.eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productoId = parseInt(e.target.dataset.id);
                eliminarProducto(productoId);
            });
        });
    }

    function actualizarCantidad(productoId, accion) {
        const itemIndex = carrito.findIndex(item => item.id === productoId);
        
        if(itemIndex >= 0) {
            if(accion === 'sumar' && carrito[itemIndex].cantidad < 50) {
                carrito[itemIndex].cantidad++;
            } else if(accion === 'restar' && carrito[itemIndex].cantidad > 1) {
                carrito[itemIndex].cantidad--;
            }
            
            localStorage.setItem('productosCarrito', JSON.stringify(carrito));
            getProductosCarrito(); // Recargar vista
        }
    }

    function eliminarProducto(productoId) {
        carrito = carrito.filter(item => item.id !== productoId);
        localStorage.setItem('productosCarrito', JSON.stringify(carrito));
        getProductosCarrito(); // Recargar vista
    }

    // Inicializar
    loadProductos();
});
