import AuthService from "../services/auth_service.js"


class HomeController {

    async start() {
        const authentication = await new AuthService().authenticate()
    
        // If the user is not authentified
        if (authentication.status() != 200) {
            const loginButton = document.querySelector("button#login_button")
            loginButton.addEventListener("click", event =>
                window.location.href = "login.html")
        } else {
            // Account button
        }
    
        const searchButton = document.querySelector("button#search_button")
        searchButton.addEventListener("click", event =>
            window.location.href = "search_list.html")
    }

}


document.addEventListener("DOMContentLoaded", new HomeController().start())