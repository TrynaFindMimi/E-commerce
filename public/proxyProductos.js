export const ProductosDestacadosProxy = (() => {
    let cache = JSON.parse(localStorage.getItem('productosDestacadosCache')) || null;

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
                            localStorage.setItem('productosDestacadosCache', JSON.stringify(data));
                            return data;
                        });
                }
            }
        }
    });
})();
export const ProductosProxy = (() => {

    return new Proxy({}, {
        get: function (target, prop) {
            console.log("Obteniendo productos desde el servidor...");
            return fetch('http://localhost:3000/productos')
                .then(response => response.json())
                .then(data => {
                    return data;
                });
        }
    });
})();
