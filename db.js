// db.js
const mysql = require('mysql2');

// Crear conexión a la base de datos
const connection = mysql.createConnection({
    host: process.env.MYHOST,
    user: process.env.MYUSER,        // Cambia esto según tu configuración de MySQL
    password: process.env.MYPASS,        // Contraseña de MySQL
    database: process.env.MYDB,
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
