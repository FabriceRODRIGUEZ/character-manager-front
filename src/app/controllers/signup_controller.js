import User from "../models/user.js"
import AuthService from "../services/auth_service.js"


class SignupController {

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


window.signupController = new SignupController()