import User from "../models/user.js"
import AuthService from "../services/auth_service.js"


/**
 * A controller for the signup page
 */
class SignupController {

    /**
     * Activates the event listeners of the page
     */
    start() {
        const textInputs = document.querySelectorAll("input[type='text'], input[type='password']")
        const submitButton = document.querySelector("button#submit_button")

        submitButton.addEventListener("click", () => this.signup())

        textInputs.forEach(textInput => textInput.addEventListener("keyup", (event) => {
            if (event.key == "Enter") this.signup()
        }))
    }

    /**
     * Validates the form and signs up the user
     */
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

        location.replace("login.html")
    }

}


document.addEventListener("DOMContentLoaded", new SignupController().start())