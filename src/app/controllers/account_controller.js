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
     * Fills the page and activates the event listeners
     */
    async start() {
        const authentication = await new AuthService().authenticate()
        this.username = await authentication.text()
        this.fillAccountWindow()

        const updateUsernameButton = document.querySelector("input#username + button.update_button")
        const updateEmailButton = document.querySelector("input#email + button.update_button")
        const updatePasswordButton = document.querySelector("input#password + button.update_button")
        const visibilityPrivateInput = document.querySelector("input[type='radio']#private")
        const visibilityPublicInput = document.querySelector("input[type='radio']#public")
        const logoutButton = document.querySelector("button#logout_button")
        const deleteAccountButton = document.querySelector("button#delete_account_button")

        updateUsernameButton.addEventListener("click", async () => this.updateUsername())
        updateEmailButton.addEventListener("click", () => this.updateEmail())
        updatePasswordButton.addEventListener("click", () => this.updatePassword())
        visibilityPrivateInput.addEventListener("click", () => this.updateVisibility("private"))
        visibilityPublicInput.addEventListener("click", () => this.updateVisibility("public"))
        logoutButton.addEventListener("click", () => this.logout())
        deleteAccountButton.addEventListener("click", () => this.deleteAccount())
    }

    /**
     * Fills the account windows with the user's information
     */
    async fillAccountWindow() {
        const user = await this.service.getUser(this.username)
        const usernameInput = document.querySelector("input#username")
        const emailInput = document.querySelector("input#email")
        const passwordInput = document.querySelector("input#password")
        const visibilityPrivateInput = document.querySelector("input[type='radio']#private")

        usernameInput.placeholder = user.username
        emailInput.placeholder = user.email
        passwordInput.placeholder = "••••••••"
        if (user.visibility == "public") {
            visibilityPrivateInput.checked = true
        }
    }

    /**
     * Fills the account windows with the user's information
     */
    async updateUsername() {
        const usernameInput = document.querySelector("input#username")
        const response = await this.service.updateUsername(this.username, usernameInput.value)
        const newUser = await response.json()
        this.username = newUser.username
        sessionStorage.setItem("token", newUser.token)
        usernameInput.placeholder = usernameInput.value
        usernameInput.removeAttribute("value")
    }

    /**
     * Updates the email adress of the user
     */
    async updateEmail() {
        const emailInput = document.querySelector("input#email")
        await this.service.updateEmail(this.username, emailInput.value)
        emailInput.placeholder = emailInput.value
        emailInput.removeAttribute("value")
    }

    /**
     * Updates the password of the user
     */
    async updatePassword() {
        const passwordInput = document.querySelector("input#password")
        await this.service.updatePassword(this.username, passwordInput.value)
        passwordInput.removeAttribute("value")
    }
    
    /**
     * Updates the visibility of the user
     * @param {string} newVisibility
     */
    async updateVisibility(newVisibility) {
        await this.service.updateVisibility(this.username, newVisibility)
    }

    /**
     * Logs out a user, then redirects to the home page
     */
    logout() {
        sessionStorage.removeItem("token")
        location.replace("home.html")
    }

    /**
     * Deletes the user account and logs out
     */
    async deleteAccount() {
        await this.service.deleteAccount()
        this.logout()
    }

}


document.addEventListener("DOMContentLoaded", new AccountController().start())