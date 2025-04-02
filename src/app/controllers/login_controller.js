class LoginController {

    async login() {
        const user_id = document.querySelector("input#user_id").value
        const password = document.querySelector("input#password").value

        // Vérifications

        const data = { "user_id": user_id, "password": password }
        const response = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(data)
        })

        // Erreur

        const body = await response.json()
        sessionStorage.setItem("token", body.token)

        window.location.replace("../pages/home.html")
    }

}

window.loginController = new LoginController()