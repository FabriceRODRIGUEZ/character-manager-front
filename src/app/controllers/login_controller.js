import AuthService from "../services/auth_service.js"


/**
 * A controller for the login page
 */
class LoginController {

    /**
     * Activates the event listeners of the page
     */
    start() {
        const submitButton = document.querySelector("button#submit_button")
        const newUserButton = document.querySelector("button#new_user")

        submitButton.addEventListener("click", (event) => this.login())

        newUserButton.addEventListener("click", (event) =>
            window.location.href = "signup.html")
    }

    /**
     * Validates the form and logs in the user
     */
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


document.addEventListener("DOMContentLoaded", new LoginController().start())