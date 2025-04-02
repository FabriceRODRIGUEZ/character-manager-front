import User from "../models/user.js"


class SignupController {

    async signup() {
        const username = document.querySelector("input#username").value
        const email = document.querySelector("input#email").value
        const password = document.querySelector("input#password").value
        const visibility = document.querySelector("input[name='visibility']:checked").value

        // Vérifications

        const user = new User(username, email, password, visibility)
        await fetch("http://localhost:8080/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        })

        // Erreur

        // Confirmation

        window.location.replace("../pages/login.html")
    }

}

window.signupController = new SignupController()