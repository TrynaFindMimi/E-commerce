document.addEventListener("DOMContentLoaded", () => {
    const favoritosContainer = document.querySelector(".lista-favoritos");

    // Obtener favoritos de localStorage o inicializar vacío
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    // Función para renderizar favoritos
    function mostrarFavoritos() {
        favoritosContainer.innerHTML = ""; // Limpiar el contenedor

        if (favoritos.length === 0) {
            favoritosContainer.innerHTML = "<p>No tienes productos en favoritos.</p>";
            return;
        }

        favoritos.forEach((producto) => {
            const productoElemento = document.createElement("div");
            productoElemento.classList.add("producto-favorito");
            productoElemento.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p class="precio">${producto.precio}</p>
                    <button class="agregar-carrito">Agregar al Carrito</button>
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
        mostrarFavoritos();
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

    // Mostrar favoritos al cargar la página
    mostrarFavoritos();
});
