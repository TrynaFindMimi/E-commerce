export const ProductosProxy = (() => {
    let cache = JSON.parse(localStorage.getItem('productosCache')) || null;

    return new Proxy({}, {
        get: function (target, prop) {
            if (prop === 'productos') {
                if (cache) {
                    console.log("Obteniendo productos desde caché...");
                    return Promise.resolve(cache);
                } else {
                    console.log("Obteniendo productos desde el servidor...");
                    return fetch('http://localhost:3000/productos/destacados')
                        .then(response => response.json())
                        .then(data => {
                            cache = data;
                            localStorage.setItem('productosCache', JSON.stringify(data));
                            return data;
                        });
                }
            }
        }
    });
})();
