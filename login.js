document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            alert("Login exitoso");
            window.location.href = "dashboard.html"; // Redirigir después del login
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error al conectar con el servidor");
    }
});
