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

// Puedes agregar rutas para compras y detalles de compra en el mismo formato

app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
