fetch('http://localhost:3000/datos_productos')
    .then(response => response.json())
    .then(data => {
        let container = document.querySelector('.datos_productos');
        data.forEach(producto => {
            let div = document.createElement('div');
            div.classList.add('producto');
            div.innerHTML = `
                <img src="images/${producto.imagen}" alt="${producto.titulo}">
                <h3>${producto.titulo}</h3>
                <p>${producto.descripcion}</p>
                <p class="precio">${producto.precio} Bs</p>
                <button>Agregar al Carrito</button>
                <button>Agrega  r a Favoritos</button>
            `;
            container.appendChild(div);
        });
    })
    .catch(error => console.error('Error cargando productos:', error));
