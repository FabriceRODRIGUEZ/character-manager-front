import User from "../models/user.js"
import AuthService from "../services/auth_service.js"


class SignupController {

    start() {
        const submitButton = document.querySelector("button#submit_button")
        submitButton.addEventListener("click", (event) => this.signup())
    }

    async signup() {
        const username = document.querySelector("input#username").value
        const email = document.querySelector("input#email").value
        const password = document.querySelector("input#password").value
        const visibility = document.querySelector("input[name='visibility']:checked").value

        // Vérifications

        const user = new User(username, email, password, visibility)
        await new AuthService().signup(user)

        // Erreur

        // Confirmation

        window.location.replace("login.html")
    }

}


document.addEventListener("DOMContentLoaded", new SignupController().start())