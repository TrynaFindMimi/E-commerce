document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const login = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Inicio de sesión exitoso. Redirigiendo...");
            window.location.href = "index.html";
        } else {
            alert("Error en el inicio de sesión: " + data.message);
        }
    } catch (error) {
        alert("Error de conexión con el servidor");
        console.error(error);
    }
});
