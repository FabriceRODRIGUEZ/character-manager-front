class LoginController {

    async login() {
        const user_id = document.querySelector("input#user_id").value
        const password = document.querySelector("input#password").value

        // Vérifications

        const response = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: { "Content-Type" : "application/json"},
            body: { "user_id" : user_id, "password" : password }
        })

        // Erreur

        sessionStorage.setItem("token", response.token)

        window.location.replace("../pages/home.html")
    }

}

window.loginController = new LoginController()