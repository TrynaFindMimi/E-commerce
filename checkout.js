document.addEventListener('DOMContentLoaded', function() {
    const subtotal = document.getElementById('subtotal');
    const totalCompra = document.getElementById('total');
    const totalPagarElement = document.getElementById('total-pagar'); 
    const carrito = JSON.parse(localStorage.getItem('productosCarrito')) || [];
    const formTarjeta = document.getElementById('form-tarjeta');
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
                        <span class="cantidad-numero" data-id="${producto.id}">${cantidad}</span>
                    </div>
                </div>
              
            `;

            totalPagarElement.appendChild(articulo);
        });
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
    formTarjeta.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const carrito = JSON.parse(localStorage.getItem('productosCarrito')) || [];
        if(carrito.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        try {
            // 1. Obtener datos necesarios
            //const idUsuario = localStorage.getItem('id_usuario'); // Asegúrate de tener este valor
            const idUsuario = 1;
            const fechaCompra = new Date().toISOString();

            // 2. Crear la compra principal
            const compraResponse = await fetch('http://localhost:3000/compras', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: idUsuario,
                    fecha_compra: fechaCompra
                })
            });

            const compraData = await compraResponse.json();
            const idCompra = compraData.id;

            // 3. Crear detalles de compra
            for(const item of carrito) {
                await fetch('http://localhost:3000/detalle_compra', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id_compra: idCompra,
                        id_producto: item.id,
                        cantidad: item.cantidad
                    })
                });
            }

            // 4. Actualizar stock y limpiar carrito
            await actualizarStock(carrito);
            localStorage.removeItem('productosCarrito');
            
            // 5. Redirigir a confirmación
            window.location.href = 'confirmacion.html';

        } catch (error) {
            console.error('Error en el proceso de compra:', error);
            alert('Error al procesar la compra: ' + error.message);
        }
    });

    async function actualizarStock(carrito) {
        // Actualizar stock para cada producto
        for(const item of carrito) {
            await fetch(`http://localhost:3000/productos/${item.id}/stock`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cantidad: item.cantidad
                })
            });
        }
    }
        // Inicializar
    loadProductos();
});
