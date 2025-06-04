import AuthService from "../services/auth_service.js"


/**
 * A controller for the login page
 */
class LoginController {

    /**
     * Activates the event listeners of the page
     */
    start() {
        const inputs = document.querySelectorAll("input")
        const submitButton = document.querySelector("button#submit_button")
        const newUserButton = document.querySelector("button#new_user")

        submitButton.addEventListener("click", () => this.login())
        newUserButton.addEventListener("click", () => location.href = "signup.html")

        inputs.forEach(input => input.addEventListener("keyup", (event) => {
            if (event.key == "Enter") this.login()
        }))
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

        location.replace("home.html")
    }

}


document.addEventListener("DOMContentLoaded", new LoginController().start())