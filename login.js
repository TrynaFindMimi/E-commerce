document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    localStorage.clear();
    
    const login = document.getElementById("nombre_usuario").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/usuarios/"+login, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.password === password){
                alert("Inicio de sesión exitoso. Redirigiendo...");
                localStorage.setItem('usuario', JSON.stringify(data));
                window.location.href = "index.html";
            } else{
                alert("password no encontrado: ");
            }
        } else {
            alert("Error en el inicio de sesión: " + data.message);
        }
    } catch (error) {
        alert("Error de conexión con el servidor");
        console.error(error);
    }
});
})