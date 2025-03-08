// db.js
const mysql = require('mysql2');

// Crear conexión a la base de datos
const connection = mysql.createConnection({
    host: 'sql10.freesqldatabase.com',
    user: 'sql10766321',        // Cambia esto según tu configuración de MySQL
    password: 'Vr9KeQvyyL',        // Contraseña de MySQL
    database: 'sql10766321',
    port: 3306
});

// Verificar conexión
connection.connect(err => {
    if (err) {
        console.error('❌ Error al conectar a la BD:', err);
        return;
    }
    console.log('✅ Conexión exitosa a la BD');
});

module.exports = connection;
