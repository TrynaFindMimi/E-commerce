// server.js
const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const app = express();
const port = 3000;

// Configuración de multer para manejar archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Middleware
app.use(bodyParser.json(), cors({
    origin: '*' // Permite todos los orígenes (solo para desarrollo)
  }));
// Rutas para usuarios
app.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(results[0]);
    });
});

app.post('/usuarios', (req, res) => {
    const { login, nombre, password } = req.body;
    db.query('INSERT INTO usuarios (login, nombre, password) VALUES (?, ?, ?)', [login, nombre, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId });
    });
});

app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { login, nombre, password } = req.body;
    db.query('UPDATE usuarios SET login = ?, nombre = ?, password = ? WHERE id = ?', [login, nombre, password, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario actualizado' });
    });
});

app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM usuarios WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado' });
    });
});

// Rutas para productos
app.get('/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const productos = results.map(producto => ({
            ...producto,
            imagen: producto.imagen.toString('base64'),
            destacado: Boolean(producto.destacado) // Convertir a booleano real
          }));
          res.json(productos)
    });
});
// ... (configuración anterior se mantiene igual)

// Nuevo endpoint para productos destacados
app.get('/productos/destacados', async (req, res) => {
    db.query('SELECT * FROM productos WHERE destacado = TRUE', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const productos = results.map(producto => ({
            ...producto,
            imagen: producto.imagen.toString('base64'),
            destacado: Boolean(producto.destacado) // Convertir a booleano real
          }));
          res.json(productos)
    });
});
  
  // ... (el resto del código anterior se mantiene)
app.get('/productos/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM productos WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const producto = {
            ...results[0],
            imagen: results[0].imagen.toString('base64') // Conversión a string
          };
      
        res.json(producto);
    });
});

app.post('/productos', upload.single('imagen'), (req, res) => {
    const { nombre, descripcion, stock, precio_unitario } = req.body;
    const imagen = req.file ? req.file.buffer : null; 
    db.query('INSERT INTO productos (nombre, descripcion, stock, imagen, precio_unitario) VALUES (?, ?, ?, ?, ?)', 
    [nombre, descripcion, stock, imagen, precio_unitario], 
    (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId });
    });
});

app.put('/productos/:id',upload.single('imagen'), (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, stock, precio_unitario } = req.body;
    const imagen = req.file ? req.file.buffer : null;
    db.query('UPDATE productos SET nombre = ?, descripcion = ?, stock = ?, imagen = ?, precio_unitario = ? WHERE id = ?', 
    [nombre, descripcion, stock, imagen, precio_unitario, id], 
    (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto actualizado' });
    });
});
app.patch('/productos/:id/stock', async (req, res) => {
    db.query(
            'UPDATE productos SET stock = stock - ? WHERE id = ?',
            [req.body.cantidad, req.params.id],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ message: 'Producto no encontrado' });
                }
                res.json({ message: 'Producto actualizado' });
            });
});

app.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM productos WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado' });
    });
});
// Rutas para compra
app.get('/compras', (req, res) => {
    db.query('SELECT * FROM compras', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/compras/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM compras WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Compra no encontrada' });
        }
        res.json(results[0]);
    });
});

app.post('/compras', (req, res) => {
    const { id_usuario, fecha_compra } = req.body;
    db.query('INSERT INTO compras (id_usuario, fecha_compra) VALUES (?, ?)', [id_usuario, fecha_compra], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId });
    });
});

app.put('/compras/:id', (req, res) => {
    const { id } = req.params;
    const { id_usuario, fecha_compra } = req.body;
    db.query('UPDATE compras SET id_usuario = ?, fecha_compra = ? WHERE id = ?', [id_usuario, fecha_compra, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Compra no encontrada' });
        }
        res.json({ message: 'Compra actualizada' });
    });
});

app.delete('/compras/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM compras WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Compra no encontrada' });
        }
        res.json({ message: 'Compra eliminada' });
    });
});

// Rutas para detalle_compra
app.get('/detalle_compra', (req, res) => {
    db.query('SELECT * FROM detalle_compra', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/detalle_compra/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM detalle_compra WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Detalle de compra no encontrado' });
        }
        res.json(results[0]);
    });
});

app.post('/detalle_compra', (req, res) => {
    const { id_compra, id_producto, cantidad } = req.body;
    db.query('INSERT INTO detalle_compra (id_compra, id_producto, cantidad) VALUES (?, ?, ?)', 
    [id_compra, id_producto, cantidad], 
    (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId });
    });
});

app.put('/detalle_compra/:id', (req, res) => {
    const { id } = req.params;
    const { id_compra, id_producto, cantidad } = req.body;
    db.query('UPDATE detalle_compra SET id_compra = ?, id_producto = ?, cantidad = ? WHERE id = ?', 
    [id_compra, id_producto, cantidad, id], 
    (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Detalle de compra no encontrado' });
        }
        res.json({ message: 'Detalle de compra actualizado' });
    });
});

app.delete('/detalle_compra/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM detalle_compra WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Detalle de compra no encontrado' });
        }
        res.json({ message: 'Detalle de compra eliminado' });
    });
});

// Puedes agregar rutas para compras y detalles de compra en el mismo formato

app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
