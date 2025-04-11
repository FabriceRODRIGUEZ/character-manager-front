import AuthService from "../services/auth_service.js"


class HomeController {

    async start() {
        const authentication = await new AuthService().authenticate()
        // const addButton = document.querySelector("button#addButton")
        // const filterButton = document.querySelector("button#filterButton")
        // const sortProperty = document.querySelector("select#sort_property")
        // const sortOrder = document.querySelector("select#sort_order")
        const searchButton = document.querySelector("button#search_button")
        const loginButton = document.querySelector("button#login_button")
        const accounButton = document.querySelector("button#account_button")

        // If the user is not authentified
        if (authentication.status == 401) {
            accounButton.style.display = "none"
            loginButton.addEventListener("click", event =>
                window.location.href = "login.html")
        } else {
            loginButton.style.display = "none"
            accounButton.addEventListener("click", event =>
                window.location.href = "account.html")
        }

        searchButton.addEventListener("click", event =>
            window.location.href = "search_list.html")
    }

}


document.addEventListener("DOMContentLoaded", new HomeController().start())