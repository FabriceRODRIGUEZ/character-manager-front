import AuthService from "../services/auth_service.js"


/**
 * A controller for the login page
 */
class LoginController {

    constructor() {
        this.toastTimeout = null
    }
    
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
        const toast = document.querySelector("div#toast")
        clearTimeout(this.toastTimeout)

        const data = { "user_id": user_id, "password": password }
        const response = await new AuthService().login(data)
        const message = (response.status != 200) ? await response.text() : null

        if (response.status == 200) {
            location.replace("home.html")
        }

        else if (message == "Missing field(s)") {
            toast.innerText = "Champ(s) manquant(s)"
            toast.classList.add("show")
            this.toastTimeout = setTimeout(() => toast.classList.remove("show"), 3000)
        }

        else if (message == "Incorrect password") {
            toast.innerText = "Mot de passe incorrect"
            toast.classList.add("show")
            this.toastTimeout = setTimeout(() => toast.classList.remove("show"), 3000)
        }
    }

}


document.addEventListener("DOMContentLoaded", new LoginController().start())