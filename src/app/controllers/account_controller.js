import UserService from "../services/user_service.js"
import AuthService from "../services/auth_service.js"


/**
 * A controller for the account page
 * @property {UserService} service
 * @property {string} username
 */
class AccountController {

    /**
     * Constructor of the account controller
     */
    constructor() {
        this.service = new UserService()
    }

    /**
     * Activates the event listeners of the page
     */
    async start() {

        const authentication = await new AuthService().authenticate()
        this.username = await authentication.text()

        const usernameInput = document.querySelector("input#username")
        const updateUsernameButton = document.querySelector("input#username + button.update_button")

        const emailInput = document.querySelector("input#email")
        const updateEmailButton = document.querySelector("input#email + button.update_button")

        const passwordInput = document.querySelector("input#password")
        const updatePasswordButton = document.querySelector("input#password + button.update_button")

        const visibilityPrivateInput = document.querySelector("input#private")
        const visibilityPublicInput = document.querySelector("input#public")

        const logoutButton = document.querySelector("button#logout_button")
        const deleteAccountButton = document.querySelector("button#delete_account_button")


        updateUsernameButton.addEventListener("click", async (event) => {
            const response = await this.service.updateUsername(this.username, usernameInput.value)
            const newUser = await response.json()
            this.username = newUser.username
            sessionStorage.setItem("token", newUser.token)
            usernameInput.value = ""
        })

        updateEmailButton.addEventListener("click", (event) => {
            this.service.updateEmail(username, emailInput.value)
            emailInput.value = ""
        })

        updatePasswordButton.addEventListener("click", (event) => {
            this.service.updatePassword(username, passwordInput.value)
            passwordInput.value = ""
        })

        visibilityPrivateInput.addEventListener("click", (event) =>
            this.service.updateVisibility(username, "private"))

        visibilityPublicInput.addEventListener("click", (event) =>
            this.service.updateVisibility(username, "public"))

        logoutButton.addEventListener("click", (event) =>
            this.logout())

        deleteAccountButton.addEventListener("click", (event) => {
            this.service.deleteAccount(username)
            this.logout()
        })

    }

    /**
     * Logs out a user
     */
    logout() {
        sessionStorage.removeItem("token")
        window.location.replace("home.html")
    }

}


document.addEventListener("DOMContentLoaded", new AccountController().start())