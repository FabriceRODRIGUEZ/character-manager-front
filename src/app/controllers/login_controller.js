import AuthService from "../services/auth_service.js"


class LoginController {

    async login() {
        const user_id = document.querySelector("input#user_id").value
        const password = document.querySelector("input#password").value

        // Vérifications

        const data = { "user_id": user_id, "password": password }
        await new AuthService().login(data)

        // Erreur

        window.location.replace("home.html")
    }

}


window.loginController = new LoginController()